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
        Schema::table('snowball', function (Blueprint $table) {
            // Add new columns
            $table->string('no_telp')->nullable()->after('nama_pengisi');
            $table->string('email')->nullable()->after('no_telp');
        });

        // Copy data from no_telp_email to new columns (if data exists)
        // This is a simple approach - we'll assume no_telp_email contains both
        // In practice, you'd need to parse this data
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('snowball', function (Blueprint $table) {
            $table->dropColumn(['no_telp', 'email']);
        });
    }
};
