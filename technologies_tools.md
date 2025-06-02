## Technologies and Tools Used

This section itemizes the key technologies, frameworks, libraries, and tools utilized in the development of the ENSIASD Taroudant E-Learning Platform.

### Backend

*   **Programming Language:** PHP (Version 8.2+)
*   **Framework:** Laravel (Version 12)
*   **Key PHP Libraries & Packages:**
    *   `inertiajs/inertia-laravel`: Server-side adapter for Inertia.js, facilitating integration with the React frontend.
    *   `prism-php/prism`: For server-side syntax highlighting capabilities.
    *   `tightenco/ziggy`: Enables the use of Laravel named routes within JavaScript.
    *   `league/flysystem-aws-s3-v3`: Provides an abstraction for file storage, configured for AWS S3. (Also supports local and other drivers).
    *   `predis/predis`: A flexible and feature-complete Redis client for PHP.

### Frontend

*   **Programming Languages:** TypeScript, JavaScript (ES6+)
*   **Framework/Library:** React (Version 19)
*   **SPA Integration:** Inertia.js (using `@inertiajs/react` adapter) for building a modern, single-page application experience with server-driven routing.
*   **Key JavaScript Libraries & Packages:**
    *   **UI & Components:**
        *   `@radix-ui/*`: A comprehensive suite of unstyled, accessible UI primitives (e.g., Dialog, Dropdown, Select, Tooltip) used as the foundation for custom components (likely following a Shadcn UI-like pattern).
        *   `lucide-react`: For a wide range of SVG icons.
        *   `@headlessui/react`: Unstyled, fully accessible UI components.
        *   `cmdk`: Command menu component for quick navigation and actions.
        *   `embla-carousel-react`: A bare-bones carousel library.
        *   `sonner`: For displaying toast notifications.
        *   `recharts`: A composable charting library.
        *   `react-day-picker`: Date picker component.
        *   `vaul`: Drawer component.
    *   **Text Editing:**
        *   `@tiptap/react` & extensions: A headless, framework-agnostic rich text editor.
    *   **Drag & Drop:**
        *   `@dnd-kit/core` & `@dnd-kit/sortable`: For implementing drag and drop interfaces.
    *   **Forms & Validation:**
        *   `zod` & `zod-form-data`: For robust schema definition and validation.
        *   `react-dropzone`: For handling file uploads via drag and drop.
        *   `input-otp`: One-time password input component.
    *   **Tables:**
        *   `@tanstack/react-table`: Headless UI for building powerful tables and datagrids.
    *   **Animation:**
        *   `framer-motion`: A production-ready motion library for React.
    *   **Utilities:**
        *   `date-fns`: Modern JavaScript date utility library.
        *   `next-themes`: For theme management (e.g., light/dark mode).

### Database

*   **Development Default:** SQLite
*   **Production Options:** MySQL, MariaDB, PostgreSQL, SQL Server (as per Laravel's standard support and `config/database.php`).
*   **Caching / Key-Value Store:** Redis (client `predis/predis` configured).

### Styling

*   **CSS Framework:** Tailwind CSS (Version 4)
*   **Utility Libraries:**
    *   `class-variance-authority` (CVA): For creating type-safe, reusable UI components with variants.
    *   `clsx`: A tiny utility for constructing `className` strings conditionally.
    *   `tailwind-merge`: Utility to merge Tailwind CSS classes without style conflicts.
    *   `tailwindcss-animate`: Plugin for Tailwind CSS that adds enter/exit animations.
    *   `@tailwindcss/typography`: Tailwind CSS plugin for styling prose/HTML content.

### Build & Development Tools

*   **JavaScript Bundler & Dev Server:** Vite
*   **PHP Dependency Manager:** Composer
*   **JavaScript Package Manager:** npm (inferred from `package-lock.json`, though `bun.lock` also exists, indicating Bun might be used by some developers or in CI).
*   **Version Control:** Git
*   **Local Development Environment:** Laravel Sail (Docker-based, provides a standardized local development experience).
*   **Debugging (Backend):** `barryvdh/laravel-debugbar` for in-browser debugging information.
*   **Linters & Formatters:**
    *   ESLint (JavaScript/TypeScript linter)
    *   Prettier (Code formatter)
    *   Laravel Pint (PHP code style fixer)

### Testing

*   **PHP Unit & Feature Testing:** Pest (built on top of PHPUnit).
*   *(Frontend testing tools like Jest or React Testing Library were not explicitly listed in the primary `package.json` devDependencies. Testing strategy for the frontend is not detailed from the provided file analysis.)*

### Server Environment (Typical Deployment)

*   **Web Server:** Nginx or Apache
*   **PHP Runtime:** PHP-FPM (FastCGI Process Manager)
*   **Database Server:** (As listed under "Database")
*   **Node.js:** Required for the frontend build process.
