<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarMovement extends Model
{
    protected $fillable = [
        'car_id', 'reservation_id', 'date_sortie', 'date_retour_prevue', 'date_retour_reelle',
    ];

    protected $casts = [
        'date_sortie' => 'datetime',
        'date_retour_prevue' => 'date',
        'date_retour_reelle' => 'datetime',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
