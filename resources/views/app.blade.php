<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ config('app.name', 'Sensus Ekonomi Crawling') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

        <!-- Blocking pre-check script - runs BEFORE React mounts -->
        <script>
            (function() {
                // Page access configuration
                var pageRoles = {
                    '/': ['guest', 'pelaku_usaha', 'pegawai', 'admin'],
                    '/sensus-ekonomi': ['guest', 'pelaku_usaha', 'pegawai', 'admin'],
                    '/panduan': ['guest', 'pelaku_usaha', 'pegawai', 'admin'],
                    '/form-prelist': ['pelaku_usaha', 'pegawai', 'admin'],
                    '/form-snowball': ['pelaku_usaha', 'pegawai', 'admin'],
                    '/crawling': ['pegawai', 'admin'],
                    '/tabel-prelist': ['pegawai', 'admin'],
                    '/tabel-snowball': ['pegawai', 'admin'],
                    '/activity-log': ['admin'],
                    '/tabel-user': ['admin'],
                };

                var currentPath = window.location.pathname;
                var allowedRoles = pageRoles[currentPath];

                // If page is not in the list, allow access
                if (!allowedRoles) return;

                // Get user data from localStorage
                var user = null;
                var isAuthenticated = false;
                try {
                    var userData = localStorage.getItem('user');
                    var token = localStorage.getItem('token');
                    if (token && userData) {
                        user = JSON.parse(userData);
                        isAuthenticated = true;
                    }
                } catch (e) {}

                // Determine user role
                var userRole = isAuthenticated && user ? user.role : 'guest';

                // Check if user role is allowed
                if (!allowedRoles.includes(userRole)) {
                    // Redirect immediately
                    if (!isAuthenticated) {
                        window.location.href = '/login';
                    } else {
                        window.location.href = '/';
                    }
                }
            })();
        </script>

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body>
        @inertia
    </body>
</html>
