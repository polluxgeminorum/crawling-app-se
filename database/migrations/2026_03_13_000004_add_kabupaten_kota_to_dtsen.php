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
        Schema::table('dtsen', function (Blueprint $table) {
            $table->string('kabupaten_kota')->nullable()->after('jenis_platform');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dtsen', function (Blueprint $table) {
            $table->dropColumn('kabupaten_kota');
        });
    }
};
