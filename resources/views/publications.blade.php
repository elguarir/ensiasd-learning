<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Announcements</title>

        <!-- Load Bootstrap CSS first -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        
        <!-- Custom fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
        
        <!-- jQuery -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        
        <!-- Just add minimal custom styling -->
        <style>
            body {
                background-color: #f8f9fa;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            
            .page-title {
                position: relative;
                padding-bottom: 1rem;
                margin-bottom: 2rem;
            }
            
            .page-title::after {
                content: '';
                position: absolute;
                width: 80px;
                height: 4px;
                background-color: #4f46e5;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 2px;
            }
            
            .card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                height: 100%;
            }
            
            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
            
            .content-preview {
                background-color: #fff;
                padding: 0;
                border-radius: 0.375rem;
            }
            
            .attachment-icon {
                margin-right: 0.5rem;
            }
        </style>
    </head>
    <body>
        @include('includes.menu')

        <div class="container py-5">
            <h1 class="text-center page-title">Publications</h1>

            @php
                use Illuminate\Support\Str;
            @endphp

            @if ($publications->isEmpty())
                <div class="text-center py-5">
                    <img src="{{ asset('images/nothing-found.svg') }}" alt="No publications found" class="img-fluid mb-3" style="max-width: 600px; opacity: 0.7; margin: 0 auto;">
                    <p class="text-muted fs-5">No publications found at this time.</p>
                </div>
            @else
                <div class="row row-cols-1 row-cols-md-2 g-4">
                    @foreach ($publications as $publication)
                        <div class="col">
                            <div class="card h-100 shadow-sm">
                                <div class="card-header d-flex align-items-center">
                                    <span class="me-2">📢</span>
                                    <h5 class="card-title mb-0">{{ $publication->course->title ?? 'Publication' }}</h5>
                                </div>
                                
                                <div class="card-body">
                                    <div class="card-text content-preview">{!! $publication->content !!}</div>
                                </div>
                                
                                <div class="card-footer bg-transparent">
                                    <div class="d-flex gap-2 flex-wrap">
                                        @if ($publication->course)
                                            <a href="{{ route('dashboard.courses.show', $publication->course->id) }}" class="btn btn-outline-secondary">
                                                <span class="me-1">🔗</span> View Course
                                            </a>
                                        @endif
                                    </div>
                                    
                                    @if ($publication->attachments && $publication->attachments->count() > 0)
                                        <div class="mt-3 pt-3 border-top">
                                            <h6 class="mb-2">
                                                <span class="attachment-icon">📎</span> Attachments
                                            </h6>
                                            <ul class="list-group list-group-flush">
                                                @foreach ($publication->attachments as $attachment)
                                                    <li class="list-group-item bg-light px-3 py-2">
                                                        <a href="{{ asset('storage/' . $attachment->path) }}" target="_blank" class="text-decoration-none">
                                                            {{ $attachment->filename }}
                                                        </a>
                                                    </li>
                                                @endforeach
                                            </ul>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        @include('includes.footer')
    </body>
</html>








