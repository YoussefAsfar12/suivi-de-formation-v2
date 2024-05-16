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
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('dateFin');
            $table->string('dateDebut');
            $table->integer('capacite_max');
            $table->string('lieu');
            $table->text('description');
            $table->string('niveau');
            $table->string('titre');
            $table->string('domaine');
            $table->boolean('disponible');
            $table->string('formateur');
            
            $table->foreignId('formateur_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
