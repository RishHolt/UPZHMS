<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ZoneType extends Model
{
    use HasFactory;

    protected $connection = 'zoning_map_db';

    protected $fillable = [
        'name',
        'description',
        'color',
        'city_id',
    ];

    public function zones()
    {
        return $this->hasMany(Zone::class, 'type_id');
    }
}
