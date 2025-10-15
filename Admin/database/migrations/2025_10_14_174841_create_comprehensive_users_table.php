<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('user_db')->create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstName');
            $table->string('lastName');
            $table->string('email')->unique();
            $table->string('contactNumber')->nullable();
            $table->enum('role', [
                'IT_ADMIN',
                'ZONING_ADMIN', 
                'ZONING_OFFICER',
                'BUILDING_ADMIN',
                'BUILDING_OFFICER'
            ])->default('ZONING_OFFICER');
            $table->enum('status', [
                'ACTIVE',
                'INACTIVE', 
                'DISABLED'
            ])->default('ACTIVE');
            $table->timestamp('lastLogin')->nullable();
            $table->timestamps();
        });

        // Auth-related tables removed
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('user_db')->dropIfExists('users');
    }
};
