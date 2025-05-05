<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Home</title>

        <link rel="stylesheet" href="{{ asset('css/home.css') }}">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">

    </head>
    <body>

        @include('includes.menu')

        <div class="content1">
            <div class="Background">
                <img src="{{ asset('images/background.jpg') }}" alt="Background">
            </div>
            <div class="text-content1">
                <div id="txt1">
                    <h1>Grow your skills, define your future</h1>
                    <p>Welcome to ENSIASD e-Learning, the official platform dedicated to ENSIASD professors.
                        Here you will find the profiles of the professors, their scientific publications and the courses they teach.</p>
                    <div>
                        <a href="#">explore courses</a>
                        <a href="#">learn more</a>
                    </div>
                </div>
                <div id="img1">
                    <img src="{{ asset('images/img1.jpg') }}" alt="img1">
                </div>
            </div>
        </div>

        <div class="content2">
            <h1>Browse our popular courses</h1>
            <div class="courses">
                @for ($i = 0; $i < 3; $i++)
                    <div class="course1">
                        <img src="{{ asset('images/img1.jpg') }}" alt="Course image">
                        <div>
                            <h3>Advanced Data Structures</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur dolorili adipiscing elit. Felit donec massa aliquam id</p>
                            <a href="#">
                                <img src="{{ asset('images/img1.jpg') }}" alt="Prof image">
                                <h4>Full name prof</h4>
                            </a>
                        </div>
                    </div>
                @endfor
            </div>
            <a href="#" id="btn-explore">Explore all courses</a>
        </div>

        @include('includes.footer')

    </body>
</html>