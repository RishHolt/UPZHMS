<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingController extends Controller
{
    /**
     * Display the building review dashboard
     */
    public function index()
    {
        return Inertia::render('module-2/BuildingDashboard');
    }
}

