<link rel="stylesheet" href="{{ asset('css/menu.css') }}">

<header class="header">
        <div class="container header-container">
            <div class="logo">
                <a href="{{ url('/') }}">ENSIASD E-Learning</a>
            </div>
            
            <nav class="desktop-menu">
                <a href="{{ url('/') }}">Home</a>
                <a href="{{ route('about') }}">About</a>
                <a href="{{ route('publications') }}">Publications</a>
                <a href="{{ route('courses') }}">Courses</a>
                <a href="{{ route('contact') }}">Contact</a>
                <a href="{{ route('login') }}" class="login-btn">Login / Register</a>
            </nav>
            
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <i class="fas fa-bars"></i>
            </button>
        </div>
        
        <div class="mobile-menu" id="mobileMenu">
            <a href="{{ url('/') }}">Home</a>
            <a href="{{ route('about') }}">About</a>
            <a href="{{ route('publications') }}">Publications</a>
            <a href="{{ route('courses') }}">Courses</a>
            <a href="{{ route('contact') }}">Contact</a>
            <a href="{{ route('login') }}" class="login-btn mobile-login">Login / Register</a>
        </div>
</header>

<script>
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn').addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
</script>
