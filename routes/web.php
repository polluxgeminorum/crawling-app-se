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
Route::get('/panduan', fn() => Inertia::render('Panduan'))->name('panduan');
Route::get('/sensus-ekonomi', fn() => Inertia::render('SensusEkonomi'))->name('sensus-ekonomi');
Route::get('/crawling', fn() => Inertia::render('Crawling'))->name('crawling');
