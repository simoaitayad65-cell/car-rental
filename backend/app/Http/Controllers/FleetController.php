<?php

namespace App\Http\Controllers;

use App\Models\Car;

class FleetController extends Controller
{
    public function index()
    {
        $cars = Car::with(['category', 'latestMovement.reservation.user'])
            ->orderBy('marque')
            ->orderBy('modele')
            ->get();

        return response()->json($cars);
    }

    public function movements(Car $car)
    {
        $movements = $car->movements()
            ->with('reservation.user')
            ->orderByDesc('date_sortie')
            ->get();

        return response()->json([
            'car' => $car->load('category'),
            'movements' => $movements,
        ]);
    }

    public function markAvailable(Car $car)
    {
        if (! in_array($car->statut, ['retournee', 'maintenance'])) {
            return response()->json(['message' => "Cette voiture n'est pas en attente de disponibilité."], 422);
        }

        $car->update(['statut' => 'disponible']);

        return response()->json($car->load('category'));
    }
}
