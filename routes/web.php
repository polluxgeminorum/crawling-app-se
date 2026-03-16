<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| 
| All routes are accessible but client-side will redirect unauthorized users.
| The router.onBefore in app.jsx handles authorization checks before rendering.
|
*/

/*
| Public pages - accessible to everyone
*/
Route::get('/', fn() => Inertia::render('Beranda'))->name('beranda');
Route::get('/panduan', fn() => Inertia::render('Panduan'))->name('panduan');
Route::get('/tentang', fn() => Inertia::render('Tentang'))->name('tentang');

/*
| Auth pages - for unauthenticated users
*/
Route::get('/login', fn() => Inertia::render('Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Register'))->name('register');

/*
| Protected pages - requires authentication (handled by client-side)
*/
Route::get('/form-crowdlisting', fn() => Inertia::render('FormCrowdlisting'))->name('form-crowdlisting');
Route::get('/form-snowball', fn() => Inertia::render('FormSnowball'))->name('form-snowball');
Route::get('/crawling', fn() => Inertia::render('Crawling'))->name('crawling');
Route::get('/tabel-crowdlisting', fn() => Inertia::render('TabelCrowdlisting'))->name('tabel-crowdlisting');
Route::get('/tabel-snowball', fn() => Inertia::render('TabelSnowball'))->name('tabel-snowball');
Route::get('/tabel-user', fn() => Inertia::render('TabelUser'))->name('tabel-user');
Route::get('/activity-log', fn() => Inertia::render('ActivityLog'))->name('activity-log');
Route::get('/form-dtsen', fn() => Inertia::render('FormDTSEN'))->name('form-dtsen');
Route::get('/tabel-dtsen', fn() => Inertia::render('TabelDTSEN'))->name('tabel-dtsen');
Route::get('/tabel-digital-tracing', fn() => Inertia::render('TabelDigitalTracing'))->name('tabel-digital-tracing');
Route::get('/dashboard-monitoring', fn() => Inertia::render('DashboardMonitoring'))->name('dashboard-monitoring');

/*
| 404 - Catch all unmatched routes
*/
Route::get('/{pathMatch?}', fn() => Inertia::render('NotFound'))->where('pathMatch', '.*');
