<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    public function index(Request $request)
    {
        $cityId = $request->get('cityId', 'caloocan');
        
        // Cache for 5 minutes
        $zones = \Cache::remember("zones_{$cityId}", 300, function () use ($cityId) {
            return Zone::where('city_id', $cityId)
                ->select(['id', 'name', 'type_id', 'color', 'coordinates', 'area', 'city_id'])
                ->get()
                ->map(function ($zone) {
                    return [
                        'id' => $zone->id,
                        'name' => $zone->name,
                        'typeId' => $zone->type_id,
                        'color' => $zone->color,
                        'coordinates' => $zone->coordinates,
                        'area' => $zone->area,
                        'cityId' => $zone->city_id,
                    ];
                });
        });

        return response()->json($zones);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'typeId' => 'required|integer',
            'color' => 'required|string|size:7',
            'coordinates' => 'required|array',
            'area' => 'nullable|string',
            'cityId' => 'required|string',
        ]);

        $zone = Zone::create([
            'name' => $validated['name'],
            'type_id' => $validated['typeId'],
            'color' => $validated['color'],
            'coordinates' => $validated['coordinates'],
            'area' => $validated['area'] ?? null,
            'city_id' => $validated['cityId'],
        ]);

        // Clear cache
        \Cache::forget("zones_{$validated['cityId']}");

        return response()->json([
            'id' => $zone->id,
            'name' => $zone->name,
            'typeId' => $zone->type_id,
            'color' => $zone->color,
            'coordinates' => $zone->coordinates,
            'area' => $zone->area,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $zone = Zone::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'typeId' => 'sometimes|required|integer',
            'color' => 'sometimes|required|string|size:7',
            'coordinates' => 'sometimes|required|array',
            'area' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($validated['name'])) $updateData['name'] = $validated['name'];
        if (isset($validated['typeId'])) $updateData['type_id'] = $validated['typeId'];
        if (isset($validated['color'])) $updateData['color'] = $validated['color'];
        if (isset($validated['coordinates'])) $updateData['coordinates'] = $validated['coordinates'];
        if (isset($validated['area'])) $updateData['area'] = $validated['area'];

        $zone->update($updateData);

        // Clear cache
        \Cache::forget("zones_{$zone->city_id}");

        return response()->json([
            'id' => $zone->id,
            'name' => $zone->name,
            'typeId' => $zone->type_id,
            'color' => $zone->color,
            'coordinates' => $zone->coordinates,
            'area' => $zone->area,
        ]);
    }

    public function destroy($id)
    {
        $zone = Zone::findOrFail($id);
        $cityId = $zone->city_id;
        $zone->delete();

        // Clear cache
        \Cache::forget("zones_{$cityId}");

        return response()->json(['message' => 'Zone deleted successfully']);
    }

    public function clearAll($cityId)
    {
        Zone::where('city_id', $cityId)->delete();

        // Clear cache
        \Cache::forget("zones_{$cityId}");
        \Cache::forget("export_{$cityId}");

        return response()->json(['message' => 'All zones cleared successfully']);
    }

    public function export($cityId)
    {
        // Cache export for 10 minutes
        $data = \Cache::remember("export_{$cityId}", 600, function () use ($cityId) {
            $zones = Zone::where('city_id', $cityId)
                ->select(['id', 'name', 'type_id', 'color', 'coordinates', 'area', 'city_id'])
                ->get();
            $zoneTypes = \App\Models\ZoneType::where('city_id', $cityId)->get();
            $regions = \App\Models\Region::where('city_id', $cityId)->get();

            return [
                'cityId' => $cityId,
                'exportedAt' => now()->toIso8601String(),
                'totalZones' => $zones->count(),
                'totalZoneTypes' => $zoneTypes->count(),
                'totalRegions' => $regions->count(),
                'zones' => $zones,
                'zoneTypes' => $zoneTypes,
                'regions' => $regions,
            ];
        });

        return response()->json($data);
    }
}
