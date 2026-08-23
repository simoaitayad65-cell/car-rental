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
        // Colonnes : categorie, marque, modele, immatriculation, prix/jour, statut, fichier Wikimedia,
        //            places, transmission, carburant, portes, climatisation, description
        $cars = [
            ['Citadine', 'Renault', 'Clio', '123-ABC-01', 35, 'disponible', '2024 Renault Clio Esprit Alpine E-Tech - 1598cc 1.6 (145PS) Petrol Hybrid - Flame Red - 05-2024, Front.jpg',
                5, 'automatique', 'hybride', 5, true, "Citadine hybride récente, idéale pour la ville et les trajets courts. Faible consommation, très maniable pour se garer facilement."],
            ['Citadine', 'Peugeot', '208', '124-ABC-01', 38, 'disponible', '2024 Peugeot 208 GT PureTech - 1200cc 1.2 (100PS) Petrol - Agueda Yellow - 06-2024, Front.jpg',
                5, 'manuelle', 'essence', 5, true, "Citadine moderne et dynamique, équipée d'une bonne motorisation essence. Parfaite pour un usage quotidien confortable."],
            ['Citadine', 'Volkswagen', 'Golf 8', '525-MNO-01', 45, 'disponible', 'Volkswagen Golf VIII Facelift IMG 8947.jpg',
                5, 'automatique', 'essence', 5, true, "Référence de sa catégorie : finitions soignées, boîte automatique agréable et bon compromis ville/route."],
            ['Berline', 'Dacia', 'Logan', '724-STU-01', 50, 'disponible', '2023 Dacia Logan III IMG 9671.jpg',
                5, 'manuelle', 'essence', 4, true, "Berline spacieuse et économique, grand coffre, parfaite pour les longs trajets en famille."],
            ['SUV', 'Dacia', 'Duster', '323-GHI-01', 55, 'disponible', 'Dacia Duster III IMG 8970.jpg',
                5, 'manuelle', 'diesel', 5, true, "SUV robuste et polyvalent, bonne garde au sol, à l'aise en ville comme sur route de campagne."],
            ['SUV', 'Volkswagen', 'T-Roc', '625-PQR-01', 58, 'disponible', '2022 Volkswagen T-Roc Life.jpg',
                5, 'automatique', 'essence', 5, true, "SUV compact premium, position de conduite haute, excellent confort sur autoroute."],
            ['Citadine', 'Mercedes-Benz', 'Classe A', '825-VWX-01', 58, 'disponible', 'Mercedes-Benz W177 (2022) 1X7A6988.jpg',
                5, 'automatique', 'essence', 5, true, "Citadine premium, intérieur haut de gamme et technologie embarquée, pour rouler avec style."],
            ['Citadine', 'Dacia', 'Spring', '912-EAS-01', 32, 'disponible', '2024 Dacia Spring Extreme GIMS 2024 1X7A2020.jpg',
                4, 'automatique', 'electrique', 5, true, "Citadine 100% électrique, économique à l'usage et parfaite pour circuler en ville sans essence."],
            ['Utilitaire', 'Peugeot', 'Partner', '913-EBS-01', 45, 'disponible', '2012 Peugeot Partner 1.6 HDI panel van.JPG',
                3, 'manuelle', 'diesel', 5, true, "Utilitaire compact au grand volume de chargement, idéal pour un déménagement ou du transport de matériel."],
            ['Berline', 'BMW', 'Série 3', '914-ECS-01', 75, 'disponible', 'BMW G20 M340i Alpine White (1).jpg',
                5, 'automatique', 'essence', 4, true, "Berline premium sportive, boîte automatique et finitions haut de gamme pour un trajet d'affaires ou de prestige."],
        ];

        foreach ($cars as [
            $categoryName, $marque, $modele, $immat, $prix, $statut, $commonsFile,
            $nbPlaces, $transmission, $carburant, $nbPortes, $climatisation, $description,
        ]) {
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
                    'nb_places' => $nbPlaces,
                    'transmission' => $transmission,
                    'carburant' => $carburant,
                    'nb_portes' => $nbPortes,
                    'climatisation' => $climatisation,
                    'description' => $description,
                ]
            );
        }
    }
}
