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
        Schema::create('crowdlisting', function (Blueprint $table) {
            $table->id();
            $table->string('no_urut_bangunan');
            $table->string('nama_keluarga_bangunan_usaha');
            $table->string('jenis_usaha');
            $table->text('alamat');
            $table->string('no_urut_keluarga');
            $table->integer('jumlah_usaha');
            $table->string('kode_pos')->nullable();
            $table->string('email')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crowdlisting');
    }
};
