<link rel="stylesheet" href="{{ asset('css/home.css') }}">

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const settings = document.querySelector(".settings");
        const showButton = document.getElementById("show");

        showButton.addEventListener("click", function () {
            settings.style.display = (settings.style.display === "block") ? "none" : "block";
        });
    });
</script>

{{-- NAVIGATION DESKTOP --}}
<nav class="menu">
    <img src="{{ asset('images/logo.png') }}" alt="Logo">
    <div class="menu-list">
        <a href="{{ route('home') }}">Home</a>
        <a href="{{ route('about') }}">About</a>
        <a href="{{ route('publications') }}">Publications</a>
        <a href="{{ route('courses') }}">Courses</a>
        <a href="{{ route('contact') }}">Contact</a>
    </div>

    <div class="btn">
        <a href="/login">
            <button type="button">Login</button>
        </a>
        <a href="/register">
            <button type="button">SignUp</button>
        </a>
    </div>


    <img src="{{ asset('images/Logo.jpg') }}" alt="Logo">
</nav>

{{-- NAVIGATION MOBILE --}}
<nav class="menu-media">
    <img src="{{ asset('images/logo.png') }}" alt="Logo">
    <label id="show">
        <img src="{{ asset('images/curseurs.png') }}" alt="Menu">
    </label>
    <div class="settings">
        <div class="menu-list">
            <a href="{{ route('home') }}">Home</a>
            <a href="{{ route('about') }}">About</a>
            <a href="{{ route('publications') }}">Publications</a>
            <a href="{{ route('courses') }}">Courses</a>
            <a href="{{ route('contact') }}">Contact</a>
        </div>

        <div class="btn">
            <a href="/login">
                <button type="button">Login</button>
            </a>
            <a href="/register">
                <button type="button">SignUp</button>
            </a>
        </div>


    </div>
    <img src="{{ asset('images/Logo.jpg') }}" alt="Logo">
</nav>
