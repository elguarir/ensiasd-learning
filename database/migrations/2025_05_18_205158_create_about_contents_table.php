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
        Schema::create('about_contents', function (Blueprint $table) {
            // Hero Section
            $table->id();
            $table->string('hero_title');
            $table->text('hero_content');
            $table->string('hero_image')->nullable();
            
            // Mission Section
            $table->string('mission_title');
            $table->text('mission_content');
            $table->string('mission_image')->nullable();
            $table->string('value1_title');
            $table->string('value2_title');
            $table->string('value3_title');
            
            // Features Section
            $table->string('features_title');
            $table->string('features_subtitle');
            
            // Features 1-6
            $table->string('feature1_title');
            $table->text('feature1_content');
            $table->string('feature2_title');
            $table->text('feature2_content');
            $table->string('feature3_title');
            $table->text('feature3_content');
            $table->string('feature4_title');
            $table->text('feature4_content');
            $table->string('feature5_title');
            $table->text('feature5_content');
            $table->string('feature6_title');
            $table->text('feature6_content');
            
            // Stats Section
            $table->integer('stat1_number');
            $table->string('stat1_label');
            $table->integer('stat2_number');
            $table->string('stat2_label');
            $table->integer('stat3_number');
            $table->string('stat3_label');
            $table->integer('stat4_number');
            $table->string('stat4_label');
            
            // Vision Section
            $table->string('vision_title');
            $table->text('vision_content');
            $table->string('vision_quote');
            $table->string('vision_author');
            $table->string('vision_image')->nullable();
            
            // Benefits Section
            $table->string('benefits_title');
            $table->string('benefits_subtitle');
            $table->string('benefits_image')->nullable();
            
            // Teacher Benefits 1-5
            $table->string('teacher_benefit1');
            $table->string('teacher_benefit2');
            $table->string('teacher_benefit3');
            $table->string('teacher_benefit4');
            $table->string('teacher_benefit5');
            
            // Student Benefits 1-5
            $table->string('student_benefit1');
            $table->string('student_benefit2');
            $table->string('student_benefit3');
            $table->string('student_benefit4');
            $table->string('student_benefit5');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_contents');
    }
};
