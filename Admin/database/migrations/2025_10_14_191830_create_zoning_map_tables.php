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
        // Create zone_types table
        Schema::connection('zoning_map_db')->create('zone_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#4CAF50'); // Hex color code
            $table->string('city_id')->default('caloocan');
            $table->timestamps();
            
            $table->index('city_id');
        });

        // Create zones table
        Schema::connection('zoning_map_db')->create('zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('type_id')->constrained('zone_types')->onDelete('restrict');
            $table->string('color', 7);
            $table->json('coordinates'); // GeoJSON format
            $table->string('area')->nullable(); // Calculated area with unit
            $table->string('city_id')->default('caloocan');
            $table->timestamps();
            
            $table->index('type_id');
            $table->index('city_id');
        });

        // Create regions table
        Schema::connection('zoning_map_db')->create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('latitude', 10, 7); // e.g., 14.7597000
            $table->decimal('longitude', 10, 7); // e.g., 121.0408000
            $table->integer('zoom_level')->default(14);
            $table->string('city_id')->default('caloocan');
            $table->timestamps();
            
            $table->index('city_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('zoning_map_db')->dropIfExists('zones');
        Schema::connection('zoning_map_db')->dropIfExists('regions');
        Schema::connection('zoning_map_db')->dropIfExists('zone_types');
    }
};
