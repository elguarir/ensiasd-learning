<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Our Courses | ENSIASD E-Learning</title>
    <link rel="stylesheet" href="{{ asset('css/courses.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* Base Styles */
:root {
    --primary: #4f46e5;
    --primary-dark: #4338ca;
    --primary-light: #6366f1;
    --secondary: #10b981;
    --dark: #1f2937;
    --dark-gray: #6b7280;
    --medium-gray: #9ca3af;
    --light-gray: #e5e7eb;
    --light: #f9fafb;
    --white: #ffffff;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --info: #3b82f6;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'IBM Plex Sans', sans-serif;
    color: var(--dark);
    line-height: 1.6;
    background-color: var(--white);
}

h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
}

a {
    text-decoration: none;
    color: inherit;
}

img {
    max-width: 100%;
    height: auto;
    display: block;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Hero Section */
.courses-hero {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: var(--white);
    padding: 100px 0 80px;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.courses-hero h1 {
    font-size: 2.8rem;
    margin-bottom: 1.5rem;
}

.hero-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2.5rem;
}

.search-bar {
    display: flex;
    max-width: 600px;
    margin: 0 auto 30px;
    background-color: var(--white);
    border-radius: 50px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.search-bar input {
    flex: 1;
    padding: 15px 25px;
    border: none;
    outline: none;
    font-size: 1rem;
}

.search-btn {
    width: 60px;
    background-color: var(--primary);
    color: var(--white);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

.search-btn:hover {
    background-color: var(--primary-dark);
}

.filter-tags {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
}

.filter-tag {
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
}

.filter-tag:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.filter-tag.active {
    background-color: var(--white);
    color: var(--primary);
    font-weight: 600;
}

/* Courses Section */
.courses-section {
    padding: 80px 0;
}

.section-header {
    text-align: center;
    margin-bottom: 50px;
}

.section-header h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--dark);
    position: relative;
    display: inline-block;
}

.section-header h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: var(--primary);
    border-radius: 2px;
}

.section-header p {
    max-width: 700px;
    margin: 0 auto;
    color: var(--dark-gray);
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}

.course-card {
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
}

.course-image {
    height: 200px;
    overflow: hidden;
}

.course-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.course-card:hover .course-image img {
    transform: scale(1.05);
}

.course-content {
    padding: 25px;
}

.course-category {
    font-size: 0.9rem;
    color: var(--primary);
    font-weight: 600;
    margin-bottom: 10px;
}

.course-title {
    font-size: 1.4rem;
    margin-bottom: 12px;
    color: var(--dark);
}

.course-description {
    color: var(--dark-gray);
    margin-bottom: 20px;
    font-size: 0.95rem;
}

.course-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: var(--dark-gray);
}

.meta-item i {
    color: var(--primary);
}

.course-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid var(--light-gray);
}

.course-btn {
    padding: 8px 20px;
    background-color: var(--primary);
    color: var(--white);
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s;
}

.course-btn:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
}

.course-btn.disabled {
    background-color: var(--medium-gray);
    cursor: not-allowed;
}


/* CTA Section */
.courses-cta {
    padding: 100px 0;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: var(--white);
    text-align: center;
}

.cta-content {
    max-width: 700px;
    margin: 0 auto;
}

.courses-cta h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
}

.courses-cta p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 40px;
}

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.cta-btn {
    padding: 15px 30px;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.3s;
}

.cta-btn.primary {
    background-color: var(--white);
    color: var(--primary);
}

.cta-btn.primary:hover {
    background-color: var(--light-gray);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.cta-btn.secondary {
    background-color: transparent;
    color: var(--white);
    border: 2px solid var(--white);
}

.cta-btn.secondary:hover {
    background-color: var(--white);
    color: var(--primary);
    transform: translateY(-3px);
}

/* Responsive Styles */
@media (max-width: 992px) {
    .courses-hero h1 {
        font-size: 2.4rem;
    }
    
    .courses-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
}

@media (max-width: 768px) {
    .courses-hero {
        padding: 80px 0 60px;
    }
    
    .courses-hero h1 {
        font-size: 2.2rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .section-header h2 {
        font-size: 2rem;
    }
    
    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .cta-btn {
        width: 100%;
        max-width: 300px;
    }
}

@media (max-width: 576px) {
    .courses-hero h1 {
        font-size: 2rem;
    }
    
    .courses-grid {
        grid-template-columns: 1fr;
    }
    
    .testimonials-grid {
        grid-template-columns: 1fr;
    }
    
    .search-bar {
        flex-direction: column;
        background-color: transparent;
        box-shadow: none;
        gap: 10px;
    }
    
    .search-bar input {
        border-radius: 6px;
        padding: 12px 20px;
    }
    
    .search-btn {
        width: 100%;
        border-radius: 6px;
        padding: 12px;
    }
}
        </style>
    
</head>
<body>

    <!-- Menu -->
    @include('includes.menu')

    <!-- Hero Section -->
    <section class="courses-hero">
        <div class="container">
            <div class="hero-content">
                <h1>Explore Our Courses</h1>
                <p class="hero-subtitle">Discover a wide range of academic programs designed to empower your learning journey at ENSIASD Taroudant</p>

                <!-- Formulaire principal avec champ de recherche -->
                <form method="GET" action="{{ route('courses.showCoursesByFiltre') }}">
                    <div class="search-bar">
                        <input id="search-input" type="text" name="search" placeholder="Search courses..." value="{{ request('search') }}">
                        <button class="search-btn" onclick="clearInputAfterSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <div class="filter-tags">
                        <span class="filter-tag {{ request('category') == 'all' || !request('category') ? 'active' : '' }}" data-category="all">All Courses</span>
                        @foreach ($categories as $category)
                            <span class="filter-tag {{ strtolower($category) == request('category') ? 'active' : '' }}" data-category="{{ strtolower($category) }}">{{ $category }}</span>
                        @endforeach
                    </div>
                </form>

                <!-- Formulaire caché pour filtrer par catégorie -->
                <form method="POST" action="{{ route('courses.showCoursesByFiltre') }}" id="category-filter-form" style="display: none;">
                    @csrf
                    @method('PUT')
                    <input type="hidden" name="category" id="category-input">
                </form>

            </div>
        </div>
    </section>

    <!-- Courses Section -->
    <section class="courses-section">
        <div class="container">
            <div class="section-header">
                <h2>Featured Courses</h2>
                <p>Browse our most popular academic programs and start your learning journey today</p>
            </div>
            
            <div class="courses-grid">
                @foreach ($courses as $course)
                    <div class="course-card">
                        <div class="course-image">
                            <img src="{{ asset($course->image) }}" alt="Course Image">
                        </div>
                        <div class="course-content">
                            <div class="course-category">{{ $course->category }}</div>
                            <h3 class="course-title">{{ $course->title }}</h3>
                            <p class="course-description">{{ Str::limit($course->description, 100) }}</p>
                            <div class="course-meta">
                                <div class="meta-item">
                                    <i class="fas fa-chalkboard-teacher"></i>
                                    <span>{{ $course->instructor->name }}</span>
                                </div>
                            </div>
                            <div class="course-footer">
                                <a href="{{ route('dashboard.courses.show', $course->id) }}" class="course-btn">View Details</a>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- Call to Action Section -->
    <section class="courses-cta">
        <div class="container">
            <div class="cta-content">
                <h2>Ready to Start Learning?</h2>
                <p>Join thousands of students at ENSIASD Taroudant who are advancing their education with our courses</p>
                <div class="cta-buttons">
                    <a href="{{ route('login') }}" class="cta-btn primary">Register Now</a>
                    <a href="{{ route('courses') }}" class="cta-btn secondary">Browse All Courses</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    @include('includes.footer')

    <!-- Hover animation -->
    <script>
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
        });
    </script>

    <!-- Script filtrage par clic sur catégorie -->
    <script>
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', function () {
                // Mettre à jour la classe active
                document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Récupérer la catégorie et soumettre le formulaire caché
                const category = this.getAttribute('data-category');
                document.getElementById('category-input').value = category;
                document.getElementById('category-filter-form').submit();
            });
        });
    </script>

    <script>
        function clearInputAfterSearch() {
            // Vider l'input de recherche après avoir cliqué sur le bouton de recherche
            document.getElementById('search-input').value = '';
        }
    </script>


</body>
</html>
