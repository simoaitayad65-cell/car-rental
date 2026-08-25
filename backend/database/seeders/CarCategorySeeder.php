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

        // Photos hébergées localement (backend/public/images/cars/), sourcées à l'origine
        // depuis Wikimedia Commons (licences libres) puis téléchargées une fois pour de bon :
        // ne plus dépendre de Wikimedia à chaque visite (fiabilité + rapidité).
        // Colonnes : categorie, marque, modele, immatriculation, prix/jour, statut, fichier local,
        //            places, transmission, carburant, portes, climatisation, description
        $cars = [
            ['Citadine', 'Renault', 'Clio', '123-ABC-01', 35, 'disponible', 'renault-clio.jpg',
                5, 'automatique', 'hybride', 5, true, "Citadine hybride récente, idéale pour la ville et les trajets courts. Faible consommation, très maniable pour se garer facilement."],
            ['Citadine', 'Peugeot', '208', '124-ABC-01', 38, 'disponible', 'peugeot-208.jpg',
                5, 'manuelle', 'essence', 5, true, "Citadine moderne et dynamique, équipée d'une bonne motorisation essence. Parfaite pour un usage quotidien confortable."],
            ['Citadine', 'Volkswagen', 'Golf 8', '525-MNO-01', 45, 'disponible', 'volkswagen-golf-8.jpg',
                5, 'automatique', 'essence', 5, true, "Référence de sa catégorie : finitions soignées, boîte automatique agréable et bon compromis ville/route."],
            ['Berline', 'Dacia', 'Logan', '724-STU-01', 50, 'disponible', 'dacia-logan.jpg',
                5, 'manuelle', 'essence', 4, true, "Berline spacieuse et économique, grand coffre, parfaite pour les longs trajets en famille."],
            ['SUV', 'Dacia', 'Duster', '323-GHI-01', 55, 'disponible', 'dacia-duster.jpg',
                5, 'manuelle', 'diesel', 5, true, "SUV robuste et polyvalent, bonne garde au sol, à l'aise en ville comme sur route de campagne."],
            ['SUV', 'Volkswagen', 'T-Roc', '625-PQR-01', 58, 'disponible', 'volkswagen-t-roc.jpg',
                5, 'automatique', 'essence', 5, true, "SUV compact premium, position de conduite haute, excellent confort sur autoroute."],
            ['Citadine', 'Mercedes-Benz', 'Classe A', '825-VWX-01', 58, 'disponible', 'mercedes-classe-a.jpg',
                5, 'automatique', 'essence', 5, true, "Citadine premium, intérieur haut de gamme et technologie embarquée, pour rouler avec style."],
            ['Citadine', 'Opel', 'Corsa', '915-OPL-01', 34, 'disponible', 'opel-corsa.jpg',
                5, 'manuelle', 'essence', 5, true, "Citadine compacte et agile, parfaite pour circuler et se garer facilement en ville."],
            ['SUV', 'Hyundai', 'Tucson', '916-TUC-01', 60, 'disponible', 'hyundai-tucson.jpg',
                5, 'automatique', 'hybride', 5, true, "SUV familial hybride, spacieux et bien équipé, confortable pour la ville comme pour la route."],
            ['SUV', 'Land Rover', 'Range Rover Evoque', '917-RRS-01', 80, 'disponible', 'range-rover-evoque.jpg',
                5, 'automatique', 'essence', 5, true, "SUV de luxe britannique compact, look racé et intérieur raffiné, pour rouler avec prestige au quotidien."],
        ];

        foreach ($cars as [
            $categoryName, $marque, $modele, $immat, $prix, $statut, $localFile,
            $nbPlaces, $transmission, $carburant, $nbPortes, $climatisation, $description,
        ]) {
            $imageUrl = rtrim((string) config('app.url'), '/').'/images/cars/'.$localFile;

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
