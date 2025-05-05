<link rel="stylesheet" href="{{ asset('css/home.css') }}">

<footer>
    <div class="logos">
        <img src="{{ asset('images/logo.png') }}" alt="Logo">
        <img src="{{ asset('images/Logo.jpg') }}" alt="Logo">
    </div>

    <div class="content3">
        <div>
            <div class="poster">
                <img src="{{ asset('images/poster.png') }}" alt="Poster">
                <h3>Subscribe to our newsletter</h3>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo</p>

            <div class="subscribe">
                <input type="email" name="sub-email" placeholder="Enter your email">
                <button>SUBMIT</button>
            </div>
        </div>

        <div class="pages">
            <h4>Pages</h4>
            <a href="{{ route('home') }}">Home</a>
            <a href="{{ route('about') }}">About</a>
            <a href="{{ route('publications') }}">Publications</a>
            <a href="{{ route('courses') }}">Courses</a>
            <a href="{{ route('contact') }}">Contact</a>
        </div>
    </div>

    <div class="copyright">
        <p>Copyright © ENSIASD e-Learning</p>
        <div class="icons">
            <a href="#"><img src="{{ asset('images/instagram.png') }}" alt="Instagram"></a>
            <a href="#"><img src="{{ asset('images/linkedin.png') }}" alt="LinkedIn"></a>
        </div>
    </div>
</footer>
