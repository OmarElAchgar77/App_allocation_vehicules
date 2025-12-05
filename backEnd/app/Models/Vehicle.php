<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;
    protected $fillable = [
        'brand', 
        'model', 
        'year', 
        'price_per_day', 
        'description', 
        'image', 
        'is_available',
        'transmission', 
        'carburant'
    ];

    public function reservations() {
        return $this->hasMany(Reservation::class);
    }
}
