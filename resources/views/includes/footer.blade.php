<link rel="stylesheet" href="{{ asset('css/footer.css') }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <a href="{{ url('/') }}" class="footer-logo">ENSIASD E-Learning</a>
                    <p>Empowering education through technology. Our e-learning platform connects teachers and students for a seamless learning experience.</p>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                
                <div class="footer-links">
                    <div class="footer-column">
                        <h3>Platform</h3>
                        <ul>
                            <li><a href="{{ route('home') }}">Home</a></li>
                            <li><a href="{{ route('about') }}">About</a></li>
                            <li><a href="{{ route('publications') }}">Publications</a></li>
                            <li><a href="{{ route('courses') }}">Courses</a></li>
                            <li><a href="{{ route('contact') }}">Contact</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-column">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="{{ url('/faq') }}">FAQ</a></li>
                            <li><a href="{{ url('/contact') }}">Contact Us</a></li>
                            <li><a href="{{ url('/privacy') }}">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; <span id="currentYear"></span> ENSIASD E-Learning Platform. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    </script>
