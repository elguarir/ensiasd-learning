<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Our E-Learning Platform</title>
    <link rel="stylesheet" href="{{ asset('css/about.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navigation Menu -->
    @include('includes.menu')

    <main>
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <div class="hero-text">
                        <h1>About Our E-Learning Platform</h1>
                        <p>Welcome to our online learning platform dedicated to empowering teachers and students at ENSIASD Taroudant. Our goal is to provide an easy-to-use and efficient virtual classroom experience, supporting academic excellence and innovation in education.</p>
                    </div>
                    <div class="hero-image">
                        <img src="{{ asset('images/img1.jpg') }}" alt="E-Learning Banner">
                    </div>
                </div>
            </div>
        </section>

        <!-- Mission Section -->
        <section class="mission">
            <div class="container">
                <div class="mission-content">
                    <div class="mission-image">
                        <img src="{{ asset('images/img1.jpg') }}" alt="Mission Image">
                    </div>
                    <div class="mission-text">
                        <h2>Our Mission</h2>
                        <p>We aim to facilitate seamless communication and collaboration between educators and learners, enabling teachers to share resources, assignments, and feedback while fostering an engaging learning environment.</p>
                        <div class="mission-values">
                            <div class="value-item">
                                <i class="fas fa-users"></i>
                                <span>Collaboration</span>
                            </div>
                            <div class="value-item">
                                <i class="fas fa-lightbulb"></i>
                                <span>Innovation</span>
                            </div>
                            <div class="value-item">
                                <i class="fas fa-graduation-cap"></i>
                                <span>Excellence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features">
            <div class="container">
                <div class="section-header">
                    <h2>Key Features</h2>
                    <p>Our platform offers a comprehensive set of tools designed to enhance the teaching and learning experience.</p>
                </div>
                
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <h3>Virtual Classrooms</h3>
                        <p>Manage dedicated digital spaces for each course with integrated teaching tools.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-file-upload"></i>
                        </div>
                        <h3>Resource Sharing</h3>
                        <p>Upload and organize all your educational materials in one centralized location.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <h3>Assignment System</h3>
                        <p>Create, distribute, collect and grade assignments seamlessly online.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>Progress Tracking</h3>
                        <p>Monitor student performance and attendance with detailed analytics.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <h3>Discussion Forums</h3>
                        <p>Interactive spaces for students and teachers to engage in academic discussions.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3>Secure Platform</h3>
                        <p>Enterprise-grade security protecting all user data and privacy.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="stats">
            <div class="container">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number" data-count="150">0</div>
                        <div class="stat-label">Active Courses</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" data-count="75">0</div>
                        <div class="stat-label">Faculty Members</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" data-count="2500">0</div>
                        <div class="stat-label">Registered Students</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" data-count="98">0</div>
                        <div class="stat-label">% Satisfaction</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Vision Section -->
        <section class="vision">
            <div class="container">
                <div class="vision-content">
                    <div class="vision-text">
                        <h2>Our Vision</h2>
                        <p>To build a dynamic and accessible digital education ecosystem that supports continuous learning, collaboration, and innovation for the academic community.</p>
                        <div class="vision-quote">
                            <blockquote>
                                "Education is the most powerful weapon which you can use to change the world."
                                <cite>- Nelson Mandela</cite>
                            </blockquote>
                        </div>
                    </div>
                    <div class="vision-image">
                        <img src="{{ asset('images/img1.jpg') }}" alt="Vision Image">
                    </div>
                </div>
            </div>
        </section>

        <!-- Benefits Section -->
        <section class="benefits">
            <div class="container">
                <div class="section-header">
                    <h2>Platform Benefits</h2>
                    <p>Discover how our platform enhances the educational experience for both teachers and students</p>
                </div>
                
                <div class="benefits-tabs">
                    <div class="tab-buttons">
                        <button class="tab-btn active" data-tab="teachers">For Teachers</button>
                        <button class="tab-btn" data-tab="students">For Students</button>
                    </div>
                    
                    <div class="tab-content active" id="teachers">
                        <div class="benefits-content">
                            <div class="benefits-image">
                                <img src="{{ asset('images/img1.jpg') }}" alt="Teacher Benefits">
                            </div>
                            <div class="benefits-text">
                                <ul class="benefits-list">
                                    <li><i class="fas fa-check-circle"></i> Easily organize and distribute course materials</li>
                                    <li><i class="fas fa-check-circle"></i> Monitor student engagement and participation</li>
                                    <li><i class="fas fa-check-circle"></i> Provide timely and personalized feedback</li>
                                    <li><i class="fas fa-check-circle"></i> Streamline assignment collection and grading</li>
                                    <li><i class="fas fa-check-circle"></i> Access powerful analytics on student performance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="students">
                        <div class="benefits-content">
                            <div class="benefits-image">
                                <img src="{{ asset('images/img1.jpg') }}" alt="Student Benefits">
                            </div>
                            <div class="benefits-text">
                                <ul class="benefits-list">
                                    <li><i class="fas fa-check-circle"></i> Access learning resources anytime, anywhere</li>
                                    <li><i class="fas fa-check-circle"></i> Submit assignments and receive feedback online</li>
                                    <li><i class="fas fa-check-circle"></i> Participate in interactive discussions</li>
                                    <li><i class="fas fa-check-circle"></i> Track your progress and grades</li>
                                    <li><i class="fas fa-check-circle"></i> Connect with instructors and peers</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    
        <!-- Contact Section -->
        <section class="contact">
            <div class="container">
                <div class="contact-content">
                    <div class="contact-text">
                        <h2>Ready to Transform Your Educational Experience?</h2>
                        <p>Join our growing community of educators and learners at ENSIASD Taroudant</p>
                    </div>
                    <div class="contact-buttons">
                        <a href="{{ url('/register') }}" class="btn-primary">Get Started Now</a>
                        <a href="{{ url('/contact') }}" class="btn-secondary">Contact Us</a>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    @include('includes.footer')


    <script>
        // Tab functionality for benefits section
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and tabs
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked button and corresponding tab
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Animate stats counter
        function animateStats() {
            const statNumbers = document.querySelectorAll('.stat-number');
            const animationDuration = 2000;
            const frameDuration = 1000 / 60;
            const totalFrames = Math.round(animationDuration / frameDuration);
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const start = 0;
                const increment = target / totalFrames;
                let current = start;
                
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        clearInterval(counter);
                        stat.textContent = target;
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, frameDuration);
            });
        }
        
        // Trigger stats animation when section is in view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(document.querySelector('.stats'));
    </script>
</body>
</html>