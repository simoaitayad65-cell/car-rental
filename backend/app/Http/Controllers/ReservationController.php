<?php

namespace App\Http\Controllers;

use App\Mail\NewReservationAdminMail;
use App\Models\Car;
use App\Models\CarMovement;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Reservation::with(['car.category', 'user']);

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show(Request $request, Reservation $reservation)
    {
        $this->authorizeAccess($request, $reservation);

        return response()->json($reservation->load(['car.category', 'user', 'payment']));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'car_id' => 'required|exists:cars,id',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:30',
            'date_debut' => 'required|date|after_or_equal:today',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $car = Car::findOrFail($request->car_id);

        if ($car->statut === 'maintenance') {
            return response()->json(['message' => 'Cette voiture est indisponible (maintenance).'], 422);
        }

        if ($this->hasOverlap($car->id, $request->date_debut, $request->date_fin)) {
            return response()->json(['message' => 'Cette voiture est déjà réservée sur cette période.'], 422);
        }

        $jours = Carbon::parse($request->date_debut)->diffInDays(Carbon::parse($request->date_fin)) + 1;

        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            'car_id' => $car->id,
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'telephone' => $request->telephone,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'statut' => 'en_attente',
            'prix_total' => $jours * $car->prix_jour,
        ]);

        $this->notifyAdmins($reservation);

        return response()->json($reservation->load('car'), 201);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:en_attente,confirmee,en_cours,terminee,annulee',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($user->role !== 'admin') {
            if ($reservation->user_id !== $user->id || $request->statut !== 'annulee') {
                abort(403, 'Action non autorisée');
            }

            if (in_array($reservation->statut, ['terminee', 'annulee'])) {
                return response()->json(['message' => 'Cette réservation ne peut plus être annulée.'], 422);
            }
        }

        $reservation->update(['statut' => $request->statut]);

        $this->syncCarTracking($reservation, $request->statut);

        return response()->json($reservation->load('car'));
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée']);
    }

    private function authorizeAccess(Request $request, Reservation $reservation): void
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $reservation->user_id !== $user->id) {
            abort(403, 'Action non autorisée');
        }
    }

    private function hasOverlap(int $carId, string $debut, string $fin): bool
    {
        return Reservation::where('car_id', $carId)
            ->where('statut', '!=', 'annulee')
            ->where('date_debut', '<=', $fin)
            ->where('date_fin', '>=', $debut)
            ->exists();
    }

    /**
     * Garde le statut de la voiture et l'historique des mouvements synchronises
     * avec le cycle de vie de la reservation (voir "Suivi des vehicules").
     */
    private function syncCarTracking(Reservation $reservation, string $newStatut): void
    {
        $car = $reservation->car;

        if ($newStatut === 'confirmee') {
            $car->update(['statut' => 'reservee']);
        } elseif ($newStatut === 'en_cours') {
            $car->update(['statut' => 'en_location']);

            CarMovement::create([
                'car_id' => $car->id,
                'reservation_id' => $reservation->id,
                'date_sortie' => now(),
                'date_retour_prevue' => $reservation->date_fin,
            ]);
        } elseif ($newStatut === 'terminee') {
            $car->update(['statut' => 'retournee']);

            CarMovement::where('reservation_id', $reservation->id)
                ->whereNull('date_retour_reelle')
                ->latest('date_sortie')
                ->first()
                ?->update(['date_retour_reelle' => now()]);
        } elseif ($newStatut === 'annulee') {
            if ($car->statut === 'reservee') {
                $car->update(['statut' => 'disponible']);
            }
        }
    }

    private function notifyAdmins(Reservation $reservation): void
    {
        $extraEmails = collect(explode(',', (string) config('mail.admin_notification_email')))
            ->map(fn ($email) => trim($email))
            ->filter();

        $emails = User::where('role', 'admin')->pluck('email')
            ->merge($extraEmails)
            ->filter()
            ->unique();

        foreach ($emails as $email) {
            try {
                Mail::to($email)->send(new NewReservationAdminMail($reservation));
            } catch (\Throwable $e) {
                Log::warning("Échec de la notification email admin ({$email}): ".$e->getMessage());
            }
        }
    }
}
