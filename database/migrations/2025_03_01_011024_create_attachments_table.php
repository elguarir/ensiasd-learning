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
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->string('original_filename');
            $table->string('path');
            $table->string('filename');
            $table->string('mime_type');
            $table->bigInteger('size')->unsigned();
            $table->string('extension')->nullable();
            $table->morphs('attachable'); // This will create attachable_id and attachable_type columns
            $table->string('collection')->default('uploads');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
