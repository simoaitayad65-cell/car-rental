<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Payment::with(['reservation.car', 'reservation.user']);

        if ($user->role !== 'admin') {
            $query->whereHas('reservation', fn ($q) => $q->where('user_id', $user->id));
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show(Request $request, Payment $payment)
    {
        $payment->load(['reservation.car', 'reservation.user']);
        $this->authorizeAccess($request, $payment);

        return response()->json($payment);
    }

    public function store(Request $request, Reservation $reservation)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $reservation->user_id !== $user->id) {
            abort(403, 'Action non autorisée');
        }

        if ($reservation->payment) {
            return response()->json(['message' => 'Cette réservation a déjà un paiement.'], 422);
        }

        if ($reservation->statut === 'annulee') {
            return response()->json(['message' => 'Impossible de payer une réservation annulée.'], 422);
        }

        $validator = Validator::make($request->all(), [
            'methode' => 'required|in:carte,especes,virement',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment = Payment::create([
            'reservation_id' => $reservation->id,
            'montant' => $reservation->prix_total,
            'methode' => $request->methode,
            'statut' => 'en_attente',
        ]);

        return response()->json($payment->load('reservation'), 201);
    }

    public function update(Request $request, Payment $payment)
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:en_attente,paye,echoue,rembourse',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment->update(['statut' => $request->statut]);

        if ($request->statut === 'paye' && $payment->reservation->statut === 'en_attente') {
            $payment->reservation->update(['statut' => 'confirmee']);
        }

        return response()->json($payment->load('reservation'));
    }

    private function authorizeAccess(Request $request, Payment $payment): void
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $payment->reservation->user_id !== $user->id) {
            abort(403, 'Action non autorisée');
        }
    }
}
