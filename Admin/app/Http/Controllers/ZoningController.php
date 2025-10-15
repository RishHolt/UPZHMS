<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ZoningController extends Controller
{
    /**
     * Display the zoning dashboard
     */
    public function index()
    {
        return Inertia::render('module-1/Dashboard');
    }

    /**
     * Display the applications list
     */
    public function applications()
    {
        return Inertia::render('module-1/Application');
    }

    /**
     * Display the zoning map
     */
    public function map()
    {
        return Inertia::render('module-1/ZoningMap');
    }

    /**
     * Display a specific application
     */
    public function show($id)
    {
        return Inertia::render('module-1/ApplicationView', [
            'applicationId' => $id
        ]);
    }
}

