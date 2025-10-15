<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use HasFactory;

    protected $connection = 'zoning_map_db';

    protected $fillable = [
        'name',
        'type_id',
        'color',
        'coordinates',
        'area',
        'city_id',
    ];

    protected $casts = [
        'coordinates' => 'array',
    ];

    public function zoneType()
    {
        return $this->belongsTo(ZoneType::class, 'type_id');
    }
}
