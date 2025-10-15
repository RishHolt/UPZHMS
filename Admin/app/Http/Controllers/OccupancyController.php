<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OccupancyController extends Controller
{
    /**
     * Display the occupancy monitoring dashboard
     */
    public function index()
    {
        return Inertia::render('module-4/OccupancyDashboard');
    }
}

