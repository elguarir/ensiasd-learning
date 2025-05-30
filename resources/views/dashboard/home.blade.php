<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Edit public pages</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light p-4">

    <div class="container" style="max-width: 900px;">

        @if (session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <ul class="mb-0">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif

        <h1 class="mb-4 text-primary">Dashboard to edit public pages :</h1>

        <!--============================Home=================================================================-->
        <h3 class="mb-4">Edit <strong>Home</strong> page :</h3>

        <form action="{{ route('app.home.update') }}" method="POST" enctype="multipart/form-data" class="mb-5">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label for="title" class="form-label">Titre</label>
                <input type="text" name="title" id="title" class="form-control" value="{{ $homeContent->title ?? '' }}" required>
            </div>

            <div class="mb-3">
                <label for="content" class="form-label">Paragraphe</label>
                <textarea name="content" id="content" rows="4" class="form-control" required>{{ $homeContent->content ?? '' }}</textarea>
            </div>

            <div class="mb-3">
                <label for="background_image" class="form-label">Background Image</label>
                @if ($homeContent && $homeContent->background_image)
                    <div class="mb-2">
                        <img src="{{ asset($homeContent->background_image) }}" alt="Image de Fond" class="img-thumbnail" style="max-width: 150px;">
                    </div>
                @endif
                <input type="file" name="background_image" id="background_image" class="form-control">
            </div>

            <div class="mb-3">
                <label for="image" class="form-label">Image</label>
                @if ($homeContent && $homeContent->image)
                    <div class="mb-2">
                        <img src="{{ asset('storage/' . $homeContent->image) }}" alt="Image" class="img-thumbnail" style="max-width: 150px;">
                    </div>
                @endif
                <input type="file" name="image" id="image" class="form-control">
            </div>

            <div class="mb-3">
                <label for="link1" class="form-label">Url for EXPLORE COURSES</label>
                <input type="text" name="link1" id="link1" class="form-control" value="{{ $homeContent->link1 ?? '' }}" required>
            </div>

            <div class="mb-3">
                <label for="link2" class="form-label">Url for LEARN MORE</label>
                <input type="text" name="link2" id="link2" class="form-control" value="{{ $homeContent->link2 ?? '' }}" required>
            </div>

            <button type="submit" class="btn btn-primary" style="background-color: #5D89BA; border: none;">
                Enregistrer les modifications
            </button>
        </form>

        <!--============================About=================================================================-->
            <hr>
            <h3 class="mb-4">Edit <strong>About</strong> page :</h3>
            
            @if (session('about_success'))
                <div class="alert alert-success">
                    {{ session('about_success') }}
                </div>
            @endif

            <form action="{{ route('app.about.update') }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')

                <!-- Hero Section -->
                <div class="card mb-4">
                    <div class="card-header bg-light">Section Principale</div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Titre</label>
                            <input type="text" name="hero_title" class="form-control" value="{{ $aboutContent->hero_title ?? '' }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Contenu</label>
                            <textarea name="hero_content" class="form-control" rows="3" required>{{ $aboutContent->hero_content ?? '' }}</textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Image</label>
                            @if(isset($aboutContent->hero_image) && $aboutContent->hero_image)
                                <img src="{{ asset('storage/'.$aboutContent->hero_image) }}" width="200" class="d-block mb-2">
                            @endif
                            <input type="file" name="hero_image" class="form-control">
                        </div>
                    </div>
                </div>

                <!-- Mission Section -->
                <div class="card mb-4">
                    <div class="card-header bg-light">Section Mission</div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Titre Mission</label>
                            <input type="text" name="mission_title" class="form-control" value="{{ $aboutContent->mission_title ?? '' }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Contenu Mission</label>
                            <textarea name="mission_content" class="form-control" rows="3" required>{{ $aboutContent->mission_content ?? '' }}</textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Image Mission</label>
                            @if(isset($aboutContent->mission_image) && $aboutContent->mission_image)
                                <img src="{{ asset('storage/'.$aboutContent->mission_image) }}" width="200" class="d-block mb-2">
                            @endif
                            <input type="file" name="mission_image" class="form-control">
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Valeur 1</label>
                                    <input type="text" name="value1_title" class="form-control" value="{{ $aboutContent->value1_title ?? '' }}" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Valeur 2</label>
                                    <input type="text" name="value2_title" class="form-control" value="{{ $aboutContent->value2_title ?? '' }}" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Valeur 3</label>
                                    <input type="text" name="value3_title" class="form-control" value="{{ $aboutContent->value3_title ?? '' }}" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Features Section -->
                <div class="card mb-4">
                    <div class="card-header bg-light">Fonctionnalités</div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Titre Section</label>
                            <input type="text" name="features_title" class="form-control" value="{{ $aboutContent->features_title ?? '' }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Sous-titre</label>
                            <input type="text" name="features_subtitle" class="form-control" value="{{ $aboutContent->features_subtitle ?? '' }}" required>
                        </div>
                        
                        <!-- Feature 1 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Titre Fonctionnalité 1</label>
                                <input type="text" name="feature1_title" class="form-control" value="{{ $aboutContent->feature1_title ?? '' }}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Description</label>
                                <input type="text" name="feature1_content" class="form-control" value="{{ $aboutContent->feature1_content ?? '' }}" required>
                            </div>
                        </div>

                        <!-- Feature 2 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Titre Fonctionnalité 2</label>
                                <input type="text" name="feature2_title" class="form-control" value="{{ old('feature2_title', $aboutContent->feature2_title ?? '') }}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Description</label>
                                <input type="text" name="feature2_content" class="form-control" value="{{ old('feature2_content', $aboutContent->feature2_content ?? '') }}" required>
                            </div>
                        </div>
                        
                        <!-- Feature 3 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Titre Fonctionnalité 3</label>
                                <input type="text" name="feature3_title" class="form-control" value="{{ old('feature3_title', $aboutContent->feature3_title ?? '') }}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Description</label>
                                <input type="text" name="feature3_content" class="form-control" value="{{ old('feature3_content', $aboutContent->feature3_content ?? '') }}" required>
                            </div>
                        </div>
                        
                        <!-- Feature 4 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Titre Fonctionnalité 4</label>
                                <input type="text" name="feature4_title" class="form-control" value="{{ old('feature4_title', $aboutContent->feature4_title ?? '') }}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Description</label>
                                <input type="text" name="feature4_content" class="form-control" value="{{ old('feature4_content', $aboutContent->feature4_content ?? '') }}" required>
                            </div>
                        </div>
                        
                        <!-- Feature 5 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Titre Fonctionnalité 5</label>
                                <input type="text" name="feature5_title" class="form-control" value="{{ old('feature5_title', $aboutContent->feature5_title ?? '') }}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Description</label>
                                <input type="text" name="feature5_content" class="form-control" value="{{ old('feature5_content', $aboutContent->feature5_content ?? '') }}" required>
                            </div>
                        </div>
                        
                        <!-- Feature 6 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Titre Fonctionnalité 6</label>
                                <input type="text" name="feature6_title" class="form-control" value="{{ old('feature6_title', $aboutContent->feature6_title ?? '') }}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Description</label>
                                <input type="text" name="feature6_content" class="form-control" value="{{ old('feature6_content', $aboutContent->feature6_content ?? '') }}" required>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Section -->
                <div class="card mb-4">
                    <div class="card-header bg-light">Statistiques</div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Stat 1 - Nombre</label>
                                    <input type="number" name="stat1_number" class="form-control" value="{{ $aboutContent->stat1_number ?? 150 }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Stat 1 - Label</label>
                                    <input type="text" name="stat1_label" class="form-control" value="{{ $aboutContent->stat1_label ?? '' }}" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Stat 2 - Nombre</label>
                                    <input type="number" name="stat2_number" class="form-control" value="{{ $aboutContent->stat2_number ?? 75 }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Stat 2 - Label</label>
                                    <input type="text" name="stat2_label" class="form-control" value="{{ $aboutContent->stat2_label ?? '' }}" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Stat 3 - Nombre</label>
                                    <input type="number" name="stat3_number" class="form-control" value="{{ $aboutContent->stat3_number ?? 2500 }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Stat 3 - Label</label>
                                    <input type="text" name="stat3_label" class="form-control" value="{{ $aboutContent->stat3_label ?? '' }}" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Stat 4 - Nombre</label>
                                    <input type="number" name="stat4_number" class="form-control" value="{{ $aboutContent->stat4_number ?? 98 }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Stat 4 - Label</label>
                                    <input type="text" name="stat4_label" class="form-control" value="{{ $aboutContent->stat4_label ?? '' }}" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vision Section -->
                <div class="card mb-4">
                    <div class="card-header bg-light">Vision</div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Titre Vision</label>
                            <input type="text" name="vision_title" class="form-control" value="{{ $aboutContent->vision_title ?? '' }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Contenu Vision</label>
                            <textarea name="vision_content" class="form-control" rows="3" required>{{ $aboutContent->vision_content ?? '' }}</textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Citation</label>
                            <input type="text" name="vision_quote" class="form-control" value="{{ $aboutContent->vision_quote ?? '' }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Auteur</label>
                            <input type="text" name="vision_author" class="form-control" value="{{ $aboutContent->vision_author ?? '' }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Image Vision</label>
                            @if(isset($aboutContent->vision_image) && $aboutContent->vision_image)
                                <img src="{{ asset('storage/'.$aboutContent->vision_image) }}" width="200" class="d-block mb-2">
                            @endif
                            <input type="file" name="vision_image" class="form-control">
                        </div>
                    </div>
                </div>

                <!-- Benefits Section -->
                <div class="card mb-4">
                    <div class="card-header bg-light">Avantages</div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Titre Avantages</label>
                            <input type="text" name="benefits_title" class="form-control" value="{{ $aboutContent->benefits_title ?? '' }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Sous-titre Avantages</label>
                            <input type="text" name="benefits_subtitle" class="form-control" value="{{ $aboutContent->benefits_subtitle ?? '' }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Image Avantages</label>
                            @if(isset($aboutContent->benefits_image) && $aboutContent->benefits_image)
                                <img src="{{ asset('storage/'.$aboutContent->benefits_image) }}" width="200" class="d-block mb-2">
                            @endif
                            <input type="file" name="benefits_image" class="form-control">
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <h4>Pour les Enseignants</h4>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 1</label>
                                    <input type="text" name="teacher_benefit1" class="form-control" value="{{ $aboutContent->teacher_benefit1 ?? '' }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 2</label>
                                    <input type="text" name="teacher_benefit2" class="form-control" value="{{ $aboutContent->teacher_benefit2 ?? '' }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 3</label>
                                    <input type="text" name="teacher_benefit3" class="form-control" value="{{ $aboutContent->teacher_benefit3 ?? '' }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 4</label>
                                    <input type="text" name="teacher_benefit4" class="form-control" value="{{ $aboutContent->teacher_benefit4 ?? '' }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 5</label>
                                    <input type="text" name="teacher_benefit5" class="form-control" value="{{ $aboutContent->teacher_benefit5 ?? '' }}" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h4>Pour les Étudiants</h4>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 1</label>
                                    <input type="text" name="student_benefit1" class="form-control" value="{{ $aboutContent->student_benefit1 ?? '' }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 2</label>
                                    <input type="text" name="student_benefit2" class="form-control" value="{{ $aboutContent->student_benefit2 ?? '' }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 3</label>
                                    <input type="text" name="student_benefit3" class="form-control" value="{{ $aboutContent->student_benefit3 ?? '' }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 4</label>
                                    <input type="text" name="student_benefit4" class="form-control" value="{{ $aboutContent->student_benefit4 ?? '' }}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Avantage 5</label>
                                    <input type="text" name="student_benefit5" class="form-control" value="{{ $aboutContent->student_benefit5 ?? '' }}" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="background-color: #5D89BA; border: none;">Enregistrer les modifications</button>
            </form>

            
            <!--============================Contact=================================================================-->
            <hr>
            <h3 class="mb-4">Edit <strong>Contact</strong> page :</h3>

            @if (session('contact_success'))
                <div class="alert alert-success">
                    {{ session('contact_success') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('app.contact.update') }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')

                <div class="mb-3">
                    <label for="school_name" class="form-label">School Name</label>
                    <input type="text" name="school_name" class="form-control" value="{{ $contactContent->school_name ?? '' }}" required>
                </div>

                <div class="mb-3">
                    <label for="address" class="form-label">Address</label>
                    <textarea name="address" class="form-control" required>{{ $contactContent->address ?? '' }}</textarea>
                </div>

                <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input type="text" name="phone" class="form-control" value="{{ $contactContent->phone ?? '' }}" required>
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" name="email" class="form-control" value="{{ $contactContent->email ?? '' }}" required>
                </div>

                <div class="mb-3">
                    <label for="office_hours" class="form-label">Office Hours</label>
                    <input type="text" name="office_hours" class="form-control" value="{{ $contactContent->office_hours ?? '' }}" required>
                </div>

                <div class="mb-3">
                    <label for="map_embed_code" class="form-label">Google Maps Embed Code</label>
                    <textarea name="map_embed_code" class="form-control" required>{{ $contactContent->map_embed_code ?? '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5337.801396860847!2d-8.869371599999998!3d30.490213699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb173001472dcc1%3A0x3f2507f09223083!2sEcole%20Nationale%20Sup%C3%A9rieure%20de%20l\'Intelligence%20Artificielle%20et%20Sciences%20des%20Donn%C3%A9es!5e0!3m2!1sfr!2sma!4v1715942550134!5m2!1sfr!2sma" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' }}</textarea>
                </div>

                <div class="mb-3">
                    <label for="contact_image" class="form-label">Contact Image</label>
                    @if ($contactContent && $contactContent->contact_image)
                        <img src="{{ asset('storage/' . $contactContent->contact_image) }}" alt="Contact Image" width="100" class="d-block mb-2">
                    @endif
                    <input type="file" name="contact_image" class="form-control">
                </div>

                <button type="submit" class="btn btn-primary" style="background-color: #5D89BA; border: none;">Enregistrer les modifications</button>
            </form>

        <!--============================Publications=================================================================-->
        <hr>
        <h3 class="mb-4">Edit <strong>Publications</strong> page :</h3>

        <h4 class="mb-3">Create a New Publication</h4>

        <form action="{{ route('app.publications.store') }}" method="POST" enctype="multipart/form-data" class="mb-5">
            @csrf

            <div class="mb-3">
                <label for="title_pub" class="form-label">Title</label>
                <input type="text" name="title" id="title_pub" class="form-control" required>
            </div>

            <div class="mb-3">
                <label for="description_pub" class="form-label">Description</label>
                <textarea name="description" id="description_pub" rows="3" class="form-control" required></textarea>
            </div>

            <div class="mb-3">
                <label for="link_pub" class="form-label">Link (optional)</label>
                <input type="url" name="link" id="link_pub" class="form-control">
            </div>

            <div class="mb-3">
                <label for="image_pub" class="form-label">Image (optional)</label>
                <input type="file" name="image" id="image_pub" class="form-control">
            </div>

            <button type="submit" class="btn btn-success">Add Publication</button>
        </form>

        <!-- Liste des publications -->
        <hr>
        <h3 class="mb-3">Existing Publications</h3>

        @if($publications->count())
            <div class="table-responsive">
                <table class="table table-bordered table-striped align-middle">
                    <thead class="table-primary">
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Link</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($publications as $publication)
                            <tr>
                                <td>{{ $publication->title }}</td>
                                <td style="max-width: 300px; white-space: normal;">{{ $publication->description }}</td>
                                <td>
                                    @if ($publication->link)
                                        <a href="{{ $publication->link }}" target="_blank" rel="noopener noreferrer">{{ $publication->link }}</a>
                                    @else
                                        -
                                    @endif
                                </td>
                                <td style="width: 120px;">
                                    @if ($publication->image)
                                        <img src="{{ asset('storage/' . $publication->image) }}" alt="Image de la publication" width="100">
                                    @else
                                        No image
                                    @endif
                                </td>
                                <td>
                                    <form action="{{ route('app.publications.destroy', $publication->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this publication?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <p>No publications found.</p>
        @endif

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>