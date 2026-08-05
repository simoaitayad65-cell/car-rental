<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('nom')->nullable()->after('user_id');
            $table->string('prenom')->nullable()->after('nom');
            $table->string('telephone')->nullable()->after('prenom');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['nom', 'prenom', 'telephone']);
        });
    }
};
