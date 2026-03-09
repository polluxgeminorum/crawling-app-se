<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public pages
Route::get('/', fn() => Inertia::render('Beranda'))->name('beranda');
Route::get('/login', fn() => Inertia::render('Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Register'))->name('register');
Route::get('/panduan', fn() => Inertia::render('Panduan'))->name('panduan');
Route::get('/sensus-ekonomi', fn() => Inertia::render('SensusEkonomi'))->name('sensus-ekonomi');
Route::get('/crawling', fn() => Inertia::render('Crawling'))->name('crawling');
Route::get('/form-prelist', fn() => Inertia::render('FormPrelist'))->name('form-prelist');
Route::get('/form-snowball', fn() => Inertia::render('FormSnowball'))->name('form-snowball');
Route::get('/tabel-prelist', fn() => Inertia::render('TabelPrelist'))->name('tabel-prelist');
Route::get('/tabel-snowball', fn() => Inertia::render('TabelSnowball'))->name('tabel-snowball');
Route::get('/tabel-user', fn() => Inertia::render('TabelUser'))->name('tabel-user');
Route::get('/activity-log', fn() => Inertia::render('ActivityLog'))->name('activity-log');
