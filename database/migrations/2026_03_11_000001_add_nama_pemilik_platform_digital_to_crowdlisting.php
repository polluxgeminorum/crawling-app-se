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
        Schema::table('crowdlisting', function (Blueprint $table) {
            $table->string('nama_pemilik')->nullable()->after('nama_keluarga_bangunan_usaha');
            $table->string('platform_digital')->nullable()->after('jenis_usaha');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crowdlisting', function (Blueprint $table) {
            $table->dropColumn(['nama_pemilik', 'platform_digital']);
        });
    }
};
