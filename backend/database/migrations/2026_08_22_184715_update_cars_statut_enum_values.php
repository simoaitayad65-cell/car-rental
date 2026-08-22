<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Elargir l'enum pour accepter a la fois l'ancienne et les nouvelles valeurs.
        DB::statement("ALTER TABLE cars MODIFY statut ENUM('disponible','loue','reservee','en_location','retournee','maintenance') NOT NULL DEFAULT 'disponible'");

        // 2. Convertir les donnees existantes.
        DB::table('cars')->where('statut', 'loue')->update(['statut' => 'en_location']);

        // 3. Retrecir l'enum a sa forme finale.
        DB::statement("ALTER TABLE cars MODIFY statut ENUM('disponible','reservee','en_location','retournee','maintenance') NOT NULL DEFAULT 'disponible'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE cars MODIFY statut ENUM('disponible','loue','reservee','en_location','retournee','maintenance') NOT NULL DEFAULT 'disponible'");

        DB::table('cars')->where('statut', 'en_location')->update(['statut' => 'loue']);
        DB::table('cars')->whereIn('statut', ['reservee', 'retournee'])->update(['statut' => 'disponible']);

        DB::statement("ALTER TABLE cars MODIFY statut ENUM('disponible','loue','maintenance') NOT NULL DEFAULT 'disponible'");
    }
};
