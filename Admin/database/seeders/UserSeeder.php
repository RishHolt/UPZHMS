<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create IT Admin user
        User::create([
            'firstName' => 'System',
            'lastName' => 'Administrator',
            'email' => 'admin@upzhms.com',
            'contactNumber' => '+63 912 345 6789',
            'role' => 'IT_ADMIN',
            'status' => 'ACTIVE',
        ]);

        // Create sample Zoning Officer
        User::create([
            'firstName' => 'Maria',
            'lastName' => 'Santos',
            'email' => 'zoning@upzhms.com',
            'contactNumber' => '+63 912 345 6790',
            'role' => 'ZONING_OFFICER',
            'status' => 'ACTIVE',
        ]);

        // Create sample Building Officer
        User::create([
            'firstName' => 'Carlos',
            'lastName' => 'Reyes',
            'email' => 'building@upzhms.com',
            'contactNumber' => '+63 912 345 6791',
            'role' => 'BUILDING_OFFICER',
            'status' => 'ACTIVE',
        ]);

        // Create sample Zoning Admin
        User::create([
            'firstName' => 'Ana',
            'lastName' => 'Garcia',
            'email' => 'zoning.admin@upzhms.com',
            'contactNumber' => '+63 912 345 6792',
            'role' => 'ZONING_ADMIN',
            'status' => 'ACTIVE',
        ]);

        // Create sample Building Admin
        User::create([
            'firstName' => 'Roberto',
            'lastName' => 'Lopez',
            'email' => 'building.admin@upzhms.com',
            'contactNumber' => '+63 912 345 6793',
            'role' => 'BUILDING_ADMIN',
            'status' => 'ACTIVE',
        ]);
    }
}
