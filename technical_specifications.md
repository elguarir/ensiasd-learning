## Technical Specifications

This section outlines the technical architecture and key components of the ENSIASD Taroudant E-Learning Platform.

-   **Backend:**
    *   Framework: Laravel 12 (PHP 8.2+)
    *   Key Libraries:
        *   `inertiajs/inertia-laravel`: For integrating the React frontend with the Laravel backend.
        *   `league/flysystem-aws-s3-v3`: For S3 file storage.
        *   `prism-php/prism`: Server-side syntax highlighting.
        *   `tightenco/ziggy`: Enables usage of Laravel named routes in JavaScript.

-   **Frontend:**
    *   Framework/Library: React 19 (using TypeScript)
    *   Integration: Inertia.js is used to build this single-page application (SPA) experience with server-side routing and controllers.
    *   Key Libraries:
        *   `@tiptap/react` & Tiptap extensions: For a rich text editor experience.
        *   `@dnd-kit/core` & `@dnd-kit/sortable`: For drag and drop functionality.
        *   `recharts`: For displaying charts (e.g., in instructor dashboards).
        *   `zod` & `zod-form-data`: For schema validation.
        *   `date-fns`: For date utility functions.
        *   `sonner`: For toast notifications.
        *   `react-dropzone`: For file uploads.
        *   `cmdk`: Command menu component.
        *   `embla-carousel-react`: Carousel component.
        *   `framer-motion`: For animations.

-   **Database:**
    *   Default (Development): SQLite (as configured in `config/database.php` and `composer.json` post-install script).
    *   Supported Production Databases: MySQL, PostgreSQL, MariaDB, SQL Server (as listed in `config/database.php`).
    *   Redis is also configured for caching and potentially other uses.

-   **Styling:**
    *   CSS Framework: Tailwind CSS (Version 4).
    *   UI Components: The project heavily utilizes Radix UI primitive components (e.g., `@radix-ui/react-accordion`, `@radix-ui/react-dialog`, etc.) and Lucide Icons (`lucide-react`). This component structure, found under `resources/js/components/ui`, is characteristic of component libraries like Shadcn UI, which are built on these primitives.
    *   Utility Libraries: `class-variance-authority`, `clsx`, `tailwind-merge` for managing CSS classes.
    *   Animations: `tailwindcss-animate`.

-   **API:**
    *   The application primarily functions as a web application using server-side rendering via Inertia.js.
    *   There is no dedicated `routes/api.php` file for token-based API routes. Specific interactions, such as quiz generation (`POST /quiz/generate`), are handled via web routes defined in `routes/web.php`, likely as AJAX requests within the authenticated session.

-   **Build Tool:**
    *   Vite: Used for frontend asset bundling and development server, configured in `vite.config.mjs`.

-   **Version Control:**
    *   Git: Inferred from the presence of `.git` related files and common development practices.

-   **Server Environment (General Assumption):**
    *   A standard PHP server environment, such as Nginx or Apache with PHP-FPM, is required to host the Laravel backend.
    *   A Node.js environment is necessary for the frontend build process.
