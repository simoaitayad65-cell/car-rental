<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index(Car $car)
    {
        return response()->json(
            $car->reviews()->with('user:id,name')->orderBy('created_at', 'desc')->get()
        );
    }

    public function store(Request $request, Car $car)
    {
        $user = $request->user();

        $hasCompletedRental = $user->reservations()
            ->where('car_id', $car->id)
            ->where('statut', 'terminee')
            ->exists();

        if (! $hasCompletedRental) {
            return response()->json([
                'message' => 'Vous ne pouvez laisser un avis que sur une voiture que vous avez louée (réservation terminée).',
            ], 422);
        }

        if (Review::where('user_id', $user->id)->where('car_id', $car->id)->exists()) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis pour cette voiture.'], 422);
        }

        $validator = Validator::make($request->all(), [
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'car_id' => $car->id,
            'note' => $request->note,
            'commentaire' => $request->commentaire,
        ]);

        return response()->json($review->load('user:id,name'), 201);
    }

    public function update(Request $request, Review $review)
    {
        $this->authorizeAccess($request, $review);

        $validator = Validator::make($request->all(), [
            'note' => 'sometimes|required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $review->update($validator->validated());

        return response()->json($review->load('user:id,name'));
    }

    public function destroy(Request $request, Review $review)
    {
        $this->authorizeAccess($request, $review);

        $review->delete();

        return response()->json(['message' => 'Avis supprimé']);
    }

    private function authorizeAccess(Request $request, Review $review): void
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $review->user_id !== $user->id) {
            abort(403, 'Action non autorisée');
        }
    }
}
