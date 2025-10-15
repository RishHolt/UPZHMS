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
        Schema::connection('zoning_map_db')->table('zones', function (Blueprint $table) {
            // Add composite index for common queries
            $table->index(['city_id', 'created_at'], 'zones_city_created_idx');
            // Name column for searches
            $table->index('name', 'zones_name_idx');
        });

        Schema::connection('zoning_map_db')->table('zone_types', function (Blueprint $table) {
            // Add composite index
            $table->index(['city_id', 'name'], 'zone_types_city_name_idx');
        });

        Schema::connection('zoning_map_db')->table('regions', function (Blueprint $table) {
            // Add composite index
            $table->index(['city_id', 'name'], 'regions_city_name_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('zoning_map_db')->table('zones', function (Blueprint $table) {
            $table->dropIndex('zones_city_created_idx');
            $table->dropIndex('zones_name_idx');
        });

        Schema::connection('zoning_map_db')->table('zone_types', function (Blueprint $table) {
            $table->dropIndex('zone_types_city_name_idx');
        });

        Schema::connection('zoning_map_db')->table('regions', function (Blueprint $table) {
            $table->dropIndex('regions_city_name_idx');
        });
    }
};
