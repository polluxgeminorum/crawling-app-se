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
            $table->dropColumn(['no_urut_bangunan', 'no_urut_keluarga']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crowdlisting', function (Blueprint $table) {
            $table->string('no_urut_bangunan');
            $table->string('no_urut_keluarga');
        });
    }
};
