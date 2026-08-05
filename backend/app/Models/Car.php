<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = [
        'category_id', 'marque', 'modele', 'immatriculation', 'prix_jour', 'statut', 'image',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function images()
    {
        return $this->hasMany(CarImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
