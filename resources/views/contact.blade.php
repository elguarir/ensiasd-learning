<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Contact</title>

    <link rel="stylesheet" href="{{ asset('css/contact.css') }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
  </head>

  <body>
    @include('includes.menu')

    <div class="contact-container">
      <h1 class="contact-title">Contact Us</h1>

      <div class="contact-content">
        <div class="contact-image">
          <img src="images/img1.jpg" alt="School Image" />
        </div>

        <div class="school-info">
          <h2>ENSIASD Learning</h2>

          <div class="info-item">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <p><strong>Address:</strong> Lastah, Taroudant, Morocco</p>
          </div>

          <div class="info-item">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 5.8c.1-.4.5-.8 1-.8h16c.5 0 .9.4 1 .8l-9 5.2-9-5.2z"/>
              <path d="M21 8.4l-9 5.2-9-5.2V18c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V8.4z"/>
            </svg>
            <p><strong>Phone:</strong> +212 661 000 00 00</p>
          </div>

          <div class="info-item">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 4h16v16H4V4z"/>
              <path d="M22 6l-10 7L2 6"/>
            </svg>
            <p><strong>Email:</strong> <a href="mailto:contact@abcschool.com">contact@ensiasd.uiz.ma</a></p>
          </div>

          <div class="info-item">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6h4"/>
            </svg>
            <p><strong>Office Hours:</strong> 8:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>

      <div class="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789!2d-122.1234567!3d37.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7abcd1234567:0x123456789abcd!2sABC Learning Center!5e0!3m2!1sen!2us!4v1620000000000!5m2!1sen!2us"
          width="100%"
          height="400"
          style="border: 0;"
          allowfullscreen=""
          loading="lazy"
          title="School Location"
        ></iframe>
      </div>
    </div>

    @include('includes.footer')
  </body>
</html>
