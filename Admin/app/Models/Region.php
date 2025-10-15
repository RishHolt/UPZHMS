<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $connection = 'zoning_map_db';

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'zoom_level',
        'city_id',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'zoom_level' => 'integer',
    ];
}
