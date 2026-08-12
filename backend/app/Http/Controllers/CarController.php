<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::with(['category', 'images']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show(Car $car)
    {
        return response()->json($car->load(['category', 'images', 'reviews.user:id,name']));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'nullable|exists:categories,id',
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'immatriculation' => 'required|string|max:255|unique:cars',
            'prix_jour' => 'required|numeric|min:0',
            'statut' => 'in:disponible,loue,maintenance',
            'image' => 'nullable|string|max:2048',
            'images' => 'array',
            'images.*' => 'string|max:2048',
            'nb_places' => 'nullable|integer|min:1|max:50',
            'transmission' => 'nullable|in:manuelle,automatique',
            'carburant' => 'nullable|in:essence,diesel,hybride,electrique',
            'nb_portes' => 'nullable|integer|min:1|max:10',
            'climatisation' => 'boolean',
            'description' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $validator->validated();
        $imagePaths = $data['images'] ?? [];
        unset($data['images']);

        $car = Car::create($data);

        foreach ($imagePaths as $path) {
            $car->images()->create(['image_path' => $path]);
        }

        return response()->json($car->load(['category', 'images']), 201);
    }

    public function update(Request $request, Car $car)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'nullable|exists:categories,id',
            'marque' => 'sometimes|required|string|max:255',
            'modele' => 'sometimes|required|string|max:255',
            'immatriculation' => 'sometimes|required|string|max:255|unique:cars,immatriculation,'.$car->id,
            'prix_jour' => 'sometimes|required|numeric|min:0',
            'statut' => 'in:disponible,loue,maintenance',
            'image' => 'nullable|string|max:2048',
            'nb_places' => 'nullable|integer|min:1|max:50',
            'transmission' => 'nullable|in:manuelle,automatique',
            'carburant' => 'nullable|in:essence,diesel,hybride,electrique',
            'nb_portes' => 'nullable|integer|min:1|max:10',
            'climatisation' => 'boolean',
            'description' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $car->update($validator->validated());

        return response()->json($car->load(['category', 'images']));
    }

    public function destroy(Car $car)
    {
        $car->delete();

        return response()->json(['message' => 'Voiture supprimée']);
    }
}
