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
        Schema::create('contact_contents', function (Blueprint $table) {
            $table->id();
            $table->string('school_name');
            $table->text('address');
            $table->string('phone');
            $table->string('email');
            $table->string('office_hours');
            $table->text('map_embed_code');
            $table->string('contact_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_contents');
    }
};
