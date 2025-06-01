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
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['file', 'quiz'])->default('file');
            $table->timestamp('due_date')->nullable();
            $table->integer('points_possible')->default(100);
            $table->boolean('published')->default(false);
            $table->text('instructions')->nullable()->after('description');
            $table->boolean('allow_late_submissions')->default(false)->after('points_possible');
            $table->integer('late_penalty_percentage')->default(0)->after('allow_late_submissions');
            $table->timestamp('available_from')->nullable()->after('published');
            $table->timestamp('available_until')->nullable()->after('available_from');
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
