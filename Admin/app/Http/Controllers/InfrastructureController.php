<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InfrastructureController extends Controller
{
    /**
     * Display the infrastructure dashboard
     */
    public function index()
    {
        return Inertia::render('module-5/InfrastructureDashboard');
    }
}

