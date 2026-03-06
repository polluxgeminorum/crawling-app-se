# Sensus Ekonomi Crawling

Aplikasi web untuk melakukan crawling data sensus ekonomi dengan Laravel, React, dan Inertia.js.

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- NPM atau Yarn
- SQLite (default) atau database lain (MySQL/PostgreSQL)

## Cara Instalasi / Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd sensusekonomi-crawling
```

### 2. Install Dependencies PHP

```bash
composer install
```

### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Jika menggunakan SQLite (default), buat file database:

```bash
touch database/database.sqlite
```

Jika menggunakan MySQL, edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sensus_ekonomi
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Migration Database

```bash
php artisan migrate
```

### 6. Install Dependencies JavaScript

```bash
npm install
```

### 7. Build Assets

```bash
npm run build
```

## Menjalankan Aplikasi

### Mode Development

Jalankan server development:

```bash
php artisan serve
```

Lalu buka browser dan akses: `http://localhost:8000`

Atau gunakan perintah lengkap (termasuk Vite, Queue, dan Logs):

```bash
composer run dev
```

### Mode Production

```bash
npm run build
php artisan serve
```

## Struktur Project

```
sensusekonomi-crawling/
├── app/                  # Kode aplikasi Laravel
│   ├── Http/Controllers/ # Controllers
│   └── Models/          # Models
├── resources/
│   ├── js/
│   │   ├── Pages/       # Halaman React
│   │   ├── Layouts/     # Layout
│   │   └── stores/      # Zustand stores
│   └── views/           # Blade templates
├── routes/               # Route definitions
├── database/
│   ├── migrations/      # Database migrations
│   └── seeders/         # Seeders
└── tests/               # Unit & Feature tests
```

## Teknologi yang Digunakan

- **Backend**: Laravel 12
- **Frontend**: React 19 + Inertia.js
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **HTTP Client**: Axios

## Lisensi

Proyek ini adalah open-source software yang dilisensikan di bawah [MIT license](https://opensource.org/licenses/MIT).
