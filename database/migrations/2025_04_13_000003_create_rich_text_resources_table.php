<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rich_text_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained('resources')->onDelete('cascade')->unique();
            $table->longText('content');
            $table->string('format')->default('html');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('rich_text_resources');
    }
}; 