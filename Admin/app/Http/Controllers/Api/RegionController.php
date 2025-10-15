<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index(Request $request)
    {
        $cityId = $request->get('cityId', 'caloocan');
        
        // Cache for 10 minutes
        $regions = \Cache::remember("regions_{$cityId}", 600, function () use ($cityId) {
            return Region::where('city_id', $cityId)->get();
        });
        
        return response()->json($regions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'zoomLevel' => 'required|integer|min:1|max:20',
            'cityId' => 'required|string',
        ]);

        $region = Region::create([
            'name' => $validated['name'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'zoom_level' => $validated['zoomLevel'],
            'city_id' => $validated['cityId'],
        ]);

        // Clear cache
        \Cache::forget("regions_{$validated['cityId']}");
        \Cache::forget("export_{$validated['cityId']}");

        return response()->json($region, 201);
    }

    public function update(Request $request, $id)
    {
        $region = Region::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'zoomLevel' => 'required|integer|min:1|max:20',
        ]);

        $region->update([
            'name' => $validated['name'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'zoom_level' => $validated['zoomLevel'],
        ]);

        // Clear cache
        \Cache::forget("regions_{$region->city_id}");
        \Cache::forget("export_{$region->city_id}");

        return response()->json($region);
    }

    public function destroy($id)
    {
        $region = Region::findOrFail($id);
        $cityId = $region->city_id;
        $region->delete();

        // Clear cache
        \Cache::forget("regions_{$cityId}");
        \Cache::forget("export_{$cityId}");

        return response()->json(['message' => 'Region deleted successfully']);
    }
}
