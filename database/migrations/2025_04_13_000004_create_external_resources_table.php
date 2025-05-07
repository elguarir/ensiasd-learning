<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('external_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained('resources')->onDelete('cascade')->unique();
            $table->string('external_url');
            $table->string('link_title')->nullable();
            $table->string('link_description')->nullable();
            $table->string('favicon_url')->nullable();
            $table->string('og_image_url')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('external_resources');
    }
}; 