<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ZoneController;
use App\Http\Controllers\Api\ZoneTypeController;
use App\Http\Controllers\Api\RegionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Zoning Map API Routes
Route::prefix('zones')->group(function () {
    Route::get('/', [ZoneController::class, 'index']);
    Route::post('/', [ZoneController::class, 'store']);
    Route::put('/{id}', [ZoneController::class, 'update']);
    Route::delete('/{id}', [ZoneController::class, 'destroy']);
    Route::delete('/clear/{cityId}', [ZoneController::class, 'clearAll']);
});

Route::prefix('zone-types')->group(function () {
    Route::get('/', [ZoneTypeController::class, 'index']);
    Route::post('/', [ZoneTypeController::class, 'store']);
    Route::put('/{id}', [ZoneTypeController::class, 'update']);
    Route::delete('/{id}', [ZoneTypeController::class, 'destroy']);
});

Route::prefix('regions')->group(function () {
    Route::get('/', [RegionController::class, 'index']);
    Route::post('/', [RegionController::class, 'store']);
    Route::put('/{id}', [RegionController::class, 'update']);
    Route::delete('/{id}', [RegionController::class, 'destroy']);
});

Route::get('/export/{cityId}', [ZoneController::class, 'export']);

