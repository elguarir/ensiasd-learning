<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutContent extends Model
{
    use HasFactory;

    protected $fillable = [
        // Hero Section
        'hero_title', 'hero_content', 'hero_image',
        
        // Mission Section
        'mission_title', 'mission_content', 'mission_image',
        'value1_title', 'value2_title', 'value3_title',
        
        // Features Section
        'features_title', 'features_subtitle',
        
        // Features 1-6
        'feature1_title', 'feature1_content',
        'feature2_title', 'feature2_content',
        'feature3_title', 'feature3_content',
        'feature4_title', 'feature4_content',
        'feature5_title', 'feature5_content',
        'feature6_title', 'feature6_content',
        
        // Stats Section
        'stat1_number', 'stat1_label',
        'stat2_number', 'stat2_label',
        'stat3_number', 'stat3_label',
        'stat4_number', 'stat4_label',
        
        // Vision Section
        'vision_title', 'vision_content', 'vision_quote', 'vision_author', 'vision_image',
        
        // Benefits Section
        'benefits_title', 'benefits_subtitle', 'benefits_image',
        
        // Teacher Benefits
        'teacher_benefit1', 'teacher_benefit2', 'teacher_benefit3', 
        'teacher_benefit4', 'teacher_benefit5',
        
        // Student Benefits
        'student_benefit1', 'student_benefit2', 'student_benefit3',
        'student_benefit4', 'student_benefit5'
    ];
}
