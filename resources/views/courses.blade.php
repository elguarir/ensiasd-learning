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
