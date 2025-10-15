<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\ZoningController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\HousingController;
use App\Http\Controllers\OccupancyController;
use App\Http\Controllers\InfrastructureController;
use App\Http\Controllers\ReviewEvaluationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('MainDashboard');
})->name('home');

// All routes are now public (no authentication required)
// Main Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('MainDashboard');
})->name('dashboard');

// Review & Evaluation routes
Route::get('/review-evaluation', [ReviewEvaluationController::class, 'index'])->name('review-evaluation');
Route::get('/api/review-evaluation/applications', [ReviewEvaluationController::class, 'getApplications'])->name('review-evaluation.applications');
Route::post('/api/review-evaluation/{applicationId}/verify', [ReviewEvaluationController::class, 'verify'])->name('review-evaluation.verify');
Route::get('/api/review-evaluation/stats', [ReviewEvaluationController::class, 'getStats'])->name('review-evaluation.stats');

// User Management routes
Route::resource('users', UserController::class);
Route::get('/user-management', [UserController::class, 'index'])->name('user-management');

// Zoning Clearance Module (Module 1)
Route::prefix('zoning')->name('zoning.')->group(function () {
    Route::get('/', [ZoningController::class, 'index'])->name('dashboard');
    Route::get('/applications', [ZoningController::class, 'applications'])->name('applications');
    Route::get('/applications/{id}', [ZoningController::class, 'show'])->name('applications.show');
    Route::get('/map', [ZoningController::class, 'map'])->name('map');
});

// Building Review Module (Module 2)
Route::prefix('building')->name('building.')->group(function () {
    Route::get('/', [BuildingController::class, 'index'])->name('dashboard');
});

// Housing Registry Module (Module 3)
Route::prefix('housing')->name('housing.')->group(function () {
    Route::get('/', [HousingController::class, 'index'])->name('dashboard');
    Route::get('/applications', [HousingController::class, 'applications'])->name('applications');
    Route::get('/applications/{id}', [HousingController::class, 'show'])->name('applications.show');
    Route::get('/beneficiaries', [HousingController::class, 'beneficiaries'])->name('beneficiaries');
    Route::get('/beneficiaries/{id}', [HousingController::class, 'beneficiaryProfile'])->name('beneficiaries.profile');
    Route::get('/units', [HousingController::class, 'units'])->name('units');
    Route::get('/reports', [HousingController::class, 'reports'])->name('reports');
});

// Occupancy Monitoring Module (Module 4)
Route::prefix('occupancy')->name('occupancy.')->group(function () {
    Route::get('/', [OccupancyController::class, 'index'])->name('dashboard');
});

// Infrastructure Module (Module 5)
Route::prefix('infrastructure')->name('infrastructure.')->group(function () {
    Route::get('/', [InfrastructureController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
// require __DIR__.'/auth.php'; // Disabled - no authentication required
