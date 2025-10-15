<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ZoneType;
use Illuminate\Http\Request;

class ZoneTypeController extends Controller
{
    public function index(Request $request)
    {
        $cityId = $request->get('cityId', 'caloocan');
        
        // Cache for 10 minutes
        $zoneTypes = \Cache::remember("zone_types_{$cityId}", 600, function () use ($cityId) {
            return ZoneType::where('city_id', $cityId)->get();
        });
        
        return response()->json($zoneTypes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:zoning_map_db.zone_types,name',
            'description' => 'nullable|string',
            'color' => 'required|string|size:7',
            'cityId' => 'required|string',
        ]);

        $zoneType = ZoneType::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'color' => $validated['color'],
            'city_id' => $validated['cityId'],
        ]);

        // Clear cache
        \Cache::forget("zone_types_{$validated['cityId']}");
        \Cache::forget("export_{$validated['cityId']}");

        return response()->json($zoneType, 201);
    }

    public function update(Request $request, $id)
    {
        $zoneType = ZoneType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:zoning_map_db.zone_types,name,' . $id,
            'description' => 'nullable|string',
            'color' => 'required|string|size:7',
        ]);

        $zoneType->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'color' => $validated['color'],
        ]);

        // Clear cache
        \Cache::forget("zone_types_{$zoneType->city_id}");
        \Cache::forget("export_{$zoneType->city_id}");

        return response()->json($zoneType);
    }

    public function destroy($id)
    {
        $zoneType = ZoneType::findOrFail($id);
        
        // Check if zone type is being used
        if ($zoneType->zones()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete zone type that is being used by zones'
            ], 422);
        }

        $cityId = $zoneType->city_id;
        $zoneType->delete();

        // Clear cache
        \Cache::forget("zone_types_{$cityId}");
        \Cache::forget("export_{$cityId}");

        return response()->json(['message' => 'Zone type deleted successfully']);
    }
}
