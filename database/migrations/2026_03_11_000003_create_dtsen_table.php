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
        Schema::create('dtsen', function (Blueprint $table) {
            $table->id();
            $table->string('no_kk');
            $table->string('jenis_usaha');
            $table->string('jenis_platform')->nullable();
            $table->enum('usaha_utama', ['Ya', 'Tidak'])->comment('Apakah usaha merupakan usaha utama atau sampingan');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dtsen');
    }
};
