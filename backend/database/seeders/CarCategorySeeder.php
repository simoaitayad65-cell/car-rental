<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Category;
use Illuminate\Database\Seeder;

class CarCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Citadine' => 'Petites voitures maniables pour la ville',
            'Berline' => 'Confort et espace pour les longs trajets',
            'SUV' => 'Voitures spacieuses, tous terrains',
            'Utilitaire' => 'Véhicules pour le transport de marchandises',
        ];

        $categoryModels = [];
        foreach ($categories as $nom => $description) {
            $categoryModels[$nom] = Category::firstOrCreate(['nom' => $nom], ['description' => $description]);
        }

        // Photos réelles (Wikimedia Commons, licences libres), un modèle récent par voiture.
        $cars = [
            ['Citadine', 'Renault', 'Clio', '123-ABC-01', 35, 'disponible', '2024 Renault Clio Esprit Alpine E-Tech - 1598cc 1.6 (145PS) Petrol Hybrid - Flame Red - 05-2024, Front.jpg'],
            ['Citadine', 'Peugeot', '208', '124-ABC-01', 38, 'disponible', '2024 Peugeot 208 GT PureTech - 1200cc 1.2 (100PS) Petrol - Agueda Yellow - 06-2024, Front.jpg'],
            ['Citadine', 'Volkswagen', 'Golf 8', '525-MNO-01', 45, 'disponible', 'Volkswagen Golf VIII Facelift IMG 8947.jpg'],
            ['Berline', 'Dacia', 'Logan', '724-STU-01', 50, 'disponible', '2023 Dacia Logan III IMG 9671.jpg'],
            ['SUV', 'Dacia', 'Duster', '323-GHI-01', 55, 'disponible', 'Dacia Duster III IMG 8970.jpg'],
            ['SUV', 'Volkswagen', 'T-Roc', '625-PQR-01', 58, 'disponible', '2022 Volkswagen T-Roc Life.jpg'],
            ['Utilitaire', 'Renault', 'Kangoo', '423-JKL-01', 45, 'disponible', 'Renault Kangoo III 1X7A1519.jpg'],
        ];

        foreach ($cars as [$categoryName, $marque, $modele, $immat, $prix, $statut, $commonsFile]) {
            $imageUrl = 'https://commons.wikimedia.org/wiki/Special:FilePath/'
                .rawurlencode($commonsFile).'?width=800';

            Car::updateOrCreate(
                ['immatriculation' => $immat],
                [
                    'category_id' => $categoryModels[$categoryName]->id,
                    'marque' => $marque,
                    'modele' => $modele,
                    'prix_jour' => $prix,
                    'statut' => $statut,
                    'image' => $imageUrl,
                ]
            );
        }
    }
}
