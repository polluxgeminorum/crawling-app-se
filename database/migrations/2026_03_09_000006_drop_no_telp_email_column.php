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
            if (Schema::hasColumn('snowball', 'no_telp_email')) {
                $table->dropColumn('no_telp_email');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('snowball', function (Blueprint $table) {
            $table->string('no_telp_email')->nullable();
        });
    }
};
