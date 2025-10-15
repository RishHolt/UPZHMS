<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HousingController extends Controller
{
    /**
     * Display the housing registry dashboard
     */
    public function index()
    {
        return Inertia::render('module-3/HousingDashboard');
    }

    /**
     * Display the housing applications
     */
    public function applications()
    {
        return Inertia::render('module-3/Applications');
    }

    /**
     * Display a specific housing application
     */
    public function show($id)
    {
        return Inertia::render('module-3/ApplicationView', [
            'applicationId' => $id
        ]);
    }

    /**
     * Display the beneficiaries list
     */
    public function beneficiaries()
    {
        return Inertia::render('module-3/Beneficiaries');
    }

    /**
     * Display a specific beneficiary profile
     */
    public function beneficiaryProfile($id)
    {
        return Inertia::render('module-3/BeneficiaryProfile', [
            'beneficiaryId' => $id
        ]);
    }

    /**
     * Display the housing units
     */
    public function units()
    {
        return Inertia::render('module-3/HousingUnits');
    }

    /**
     * Display the reports page
     */
    public function reports()
    {
        return Inertia::render('module-3/Reports');
    }
}

