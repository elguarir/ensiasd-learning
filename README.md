# ENSIASD E-Learning Platform

A comprehensive digital educational solution tailored specifically for ENSIASD Taroudant, built with Laravel and React. This platform facilitates meaningful connections between instructors and students through technology, creating an environment where educational content delivery, student engagement, and administrative oversight converge seamlessly.

## 🎯 Overview

The ENSIASD E-Learning Platform serves three distinct user communities:
- **Students** seeking flexible access to quality education
- **Instructors** requiring comprehensive tools for course delivery and student engagement  
- **Administrators** managing institutional content and system oversight

## ✨ Key Features

### For Students
- 📚 **Course Enrollment**: Join courses using course codes or invite links
- 📖 **Rich Content Access**: View chapters, documents, videos, links, and interactive content
- 📝 **Assignment Submission**: Submit assignments with text and file uploads
- 🧠 **Interactive Quizzes**: Take assessments to test understanding
- 💬 **Discussion Forums**: Participate in course-specific discussions
- 📢 **Announcements**: Stay updated with course announcements
- 📊 **Progress Tracking**: Monitor grades and academic progress

### For Instructors
- 🎨 **Course Creation**: Design courses with titles, descriptions, images, and themes
- 📑 **Content Management**: Organize courses into chapters with diverse resource types
- 📋 **Assignment Management**: Create assignments with detailed instructions and due dates
- 🧪 **Quiz Builder**: Develop assessments with various question types
- ✅ **Grading System**: Review submissions and provide grades with feedback
- 📊 **Analytics Dashboard**: View course statistics and student engagement metrics
- 👥 **Student Management**: Manage enrollments and track student progress

### For Administrators
- 🌐 **Website Management**: Control public-facing content (Home, About, Contact, Publications)
- 🏛️ **Institutional Oversight**: Manage platform-wide settings and content
- 📈 **System Analytics**: Monitor platform usage and performance

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.3+)
- **Database**: MySQL/PostgreSQL/SQLite
- **Cache**: Redis
- **Storage**: AWS S3 (configurable)
- **Authentication**: Laravel Sanctum
- **API**: Inertia.js for SPA experience

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Rich Text Editor**: TipTap
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Development Tools
- **Build Tool**: Vite
- **Package Manager**: Bun (recommended) / npm
- **Code Quality**: ESLint, Prettier
- **Development Environment**: Herd

## 🚀 Installation

### Prerequisites
- PHP 8.3 or higher
- Node.js 18+ 
- Composer
- Bun (recommended) or npm
- MySQL/PostgreSQL (or SQLite for development)
- Redis (optional but recommended)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ensiasd-learning
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure your `.env` file**
   ```env
   DB_CONNECTION=sqlite
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ensiasd_learning
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   # Redis (optional)
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379

   # File Storage (AWS S3 or local)
   FILESYSTEM_DISK=local
   # For S3:
   # AWS_ACCESS_KEY_ID=your_access_key
   # AWS_SECRET_ACCESS_KEY=your_secret_key
   # AWS_DEFAULT_REGION=us-east-1
   # AWS_BUCKET=your_bucket_name
   ```

6. **Database setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Build frontend assets**
   ```bash
   bun run build
   # or for development
   bun run dev
   ```

8. **Start the development server**
   ```bash
   php artisan serve
   ```

## 📖 Usage

### Development Workflow

1. **Start the development servers**
   ```bash
   # Backend (Laravel)
   php artisan serve
   
   # Frontend (Vite)
   bun run dev
   ```

2. **Database operations**
   ```bash
   # Run migrations
   php artisan migrate
   
   # Seed database
   php artisan db:seed
   
   # Reset database
   php artisan migrate:fresh --seed
   ```

### Production Deployment

1. **Optimize for production**
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   bun run build
   ```

## 🏗️ Project Structure

```
ensiasd-learning/
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # Request handlers
│   ├── Models/            # Eloquent models
│   ├── Services/          # Business logic services
│   └── Traits/            # Reusable traits
├── resources/
│   ├── js/                # React frontend code
│   │   ├── components/    # React components
│   │   ├── pages/         # Inertia.js pages
│   │   ├── layouts/       # Layout components
│   │   └── types/         # TypeScript definitions
│   └── css/               # Stylesheets
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/           # Database seeders
├── routes/                # Application routes
└── public/                # Public assets
```

## 🔧 Configuration

### Key Configuration Files

- `config/database.php` - Database connections
- `config/filesystems.php` - File storage configuration
- `config/inertia.php` - Inertia.js settings
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.mjs` - Vite build configuration
- `tsconfig.json` - TypeScript configuration

### Environment Variables

Key environment variables to configure:

```env
APP_NAME="ENSIASD E-Learning Platform"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=your-region
AWS_BUCKET=your-bucket
```


## 👥 Team

**Developed by:**
- MOHAMED EL GUARIR
- MOHAMED EL HADDATI  
- DOUNYA ZAHIDI
- BAHRI MALAK

**Supervised by:**
- M. Mohamed Saad AZIZI

## 📞 Support

For support and questions, please contact the development team or refer to the project documentation.

---

**ENSIASD Taroudant** - Année universitaire: 2024-2025 