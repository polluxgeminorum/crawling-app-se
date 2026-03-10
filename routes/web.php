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
Route::get('/form-prelist', fn() => Inertia::render('FormPrelist'))->name('form-prelist');
Route::get('/form-snowball', fn() => Inertia::render('FormSnowball'))->name('form-snowball');
Route::get('/crawling', fn() => Inertia::render('Crawling'))->name('crawling');
Route::get('/tabel-prelist', fn() => Inertia::render('TabelPrelist'))->name('tabel-prelist');
Route::get('/tabel-snowball', fn() => Inertia::render('TabelSnowball'))->name('tabel-snowball');
Route::get('/tabel-user', fn() => Inertia::render('TabelUser'))->name('tabel-user');
Route::get('/activity-log', fn() => Inertia::render('ActivityLog'))->name('activity-log');

/*
| 404 - Catch all unmatched routes
*/
Route::get('/{pathMatch?}', fn() => Inertia::render('NotFound'))->where('pathMatch', '.*');
