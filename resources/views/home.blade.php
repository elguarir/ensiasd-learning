<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ENSIASD E-Learning Platform | Home</title>
    <link rel="stylesheet" href="{{ asset('css/home.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    @include('includes.menu')

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-background">
            <img src="{{ $homeContent->background_image ?? asset('images/default-hero-bg.jpg') }}" alt="E-Learning Platform">
            <div class="overlay"></div>
        </div>
        
        <div class="hero-content container">
            <div class="hero-text">
                <h1>{{ $homeContent->title ?? 'Empowering Education Through Technology' }}</h1>
                <p class="hero-description">{{ $homeContent->content ?? 'Discover our innovative e-learning platform designed for ENSIASD Taroudant students and faculty.' }}</p>
                <div class="hero-cta">
                    <a href="{{ url('/courses') }}" class="btn-primary">
                        Explore Courses <i class="fas fa-arrow-right"></i>
                    </a>
                    <a href="{{ url('/about') }}" class="btn-secondary">
                        Learn More <i class="fas fa-info-circle"></i>
                    </a>
                </div>
            </div>
            <div class="hero-image">
                <img src="{{ $homeContent->image ?? asset('images/hero-image.png') }}" alt="E-Learning Illustration" class="floating-animation">
            </div>
        </div>
    </section>

    <!-- Popular Courses Section -->
    <section class="courses-section">
        <div class="container">
            <div class="section-header">
                <h2>Browse Our Popular Courses</h2>
                <p>Discover the most sought-after programs at ENSIASD Taroudant</p>
            </div>
            
            <div class="courses-grid">
                @foreach ($courses as $course)
                <div class="course-card">
                    <div class="course-image">
                        <img src="{{ $course->image }}" alt="{{ $course->title }}">
                    </div>
                    <div class="course-content">
                        <div class="course-category">{{ $course->category ?? 'General' }}</div>
                        <h3>{{ $course->title }}</h3>
                        <p class="course-description">{{ Str::limit($course->description, 100) }}</p>
                        
                        <div class="course-meta">
                            <div class="instructor-info">
                                <img src="{{ $course->instructor->avatar }}" alt="{{ $course->instructor->name }}" class="instructor-avatar">
                                <span>{{ $course->instructor->name }}</span>
                            </div>
                        </div>
                        
                            View Course <i class="fas fa-chevron-right"></i>
                        </a>
                    </div>
                </div>
                @endforeach
            </div>
            
            <div class="text-center">
                <a href="{{ url('/courses') }}" class="btn-explore">
                    Explore All Courses <i class="fas fa-book-open"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <div class="section-header">
                <h2>Why Choose Our Platform</h2>
                <p>Experience the best in digital education</p>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-laptop-code"></i>
                    </div>
                    <h3>Interactive Learning</h3>
                    <p>Engage with multimedia content, quizzes, and interactive exercises.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <h3>Expert Instructors</h3>
                    <p>Learn from experienced faculty members and industry professionals.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3>Flexible Schedule</h3>
                    <p>Access course materials anytime, anywhere at your own pace.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-certificate"></i>
                    </div>
                    <h3>Certification</h3>
                    <p>Earn recognized certificates upon course completion.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2>Ready to Start Learning?</h2>
                <p>Join thousands of students at ENSIASD Taroudant who are advancing their education with our platform</p>
                <div class="cta-buttons">
                    <a href="/register" class="btn btn-primary">Register Now</a>
                    <a href="/contact" class="btn btn-secondary">Contact Us</a>
                </div>
            </div>
        </div>
    </section>

    @include('includes.footer')

    <script>
        // Simple animation for course cards
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        // Floating animation for hero image
        const floatingImage = document.querySelector('.floating-animation');
        if (floatingImage) {
            function floatAnimation() {
                floatingImage.style.transform = `translateY(${Math.sin(Date.now() / 800) * 10}px)`;
                requestAnimationFrame(floatAnimation);
            }
            floatAnimation();
        }
    </script>
</body>
</html>