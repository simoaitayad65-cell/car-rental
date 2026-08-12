<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->unsignedTinyInteger('nb_places')->nullable()->after('statut');
            $table->enum('transmission', ['manuelle', 'automatique'])->nullable()->after('nb_places');
            $table->enum('carburant', ['essence', 'diesel', 'hybride', 'electrique'])->nullable()->after('transmission');
            $table->unsignedTinyInteger('nb_portes')->nullable()->after('carburant');
            $table->boolean('climatisation')->default(true)->after('nb_portes');
            $table->text('description')->nullable()->after('climatisation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->dropColumn(['nb_places', 'transmission', 'carburant', 'nb_portes', 'climatisation', 'description']);
        });
    }
};
