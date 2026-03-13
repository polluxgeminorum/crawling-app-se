<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CrowdlistingController;
use App\Http\Controllers\Api\SnowballController;
use App\Http\Controllers\Api\LogActivityController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DtsenController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Crowdlisting routes (CRUD)
    Route::get('/crowdlisting', [CrowdlistingController::class, 'index']);
    Route::post('/crowdlisting', [CrowdlistingController::class, 'store']);
    Route::get('/crowdlisting/{id}', [CrowdlistingController::class, 'show']);
    Route::put('/crowdlisting/{id}', [CrowdlistingController::class, 'update']);
    Route::delete('/crowdlisting/{id}', [CrowdlistingController::class, 'destroy']);
    
    // Snowball routes (CRUD)
    Route::get('/snowball', [SnowballController::class, 'index']);
    Route::post('/snowball', [SnowballController::class, 'store']);
    Route::get('/snowball/{id}', [SnowballController::class, 'show']);
    Route::put('/snowball/{id}', [SnowballController::class, 'update']);
    Route::delete('/snowball/{id}', [SnowballController::class, 'destroy']);
    Route::post('/snowball/sync', [SnowballController::class, 'sync']);

    // Log Activity routes
    Route::get('/log-activities', [LogActivityController::class, 'index']);
    Route::post('/log-activities', [LogActivityController::class, 'store']);
    Route::get('/log-activities/statistics', [LogActivityController::class, 'statistics']);
    Route::get('/log-activities/{id}', [LogActivityController::class, 'show']);

    // User management routes
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    // DTSEN routes (CRUD)
    Route::get('/dtsen', [DtsenController::class, 'index']);
    Route::post('/dtsen', [DtsenController::class, 'store']);
    Route::get('/dtsen/{id}', [DtsenController::class, 'show']);
    Route::put('/dtsen/{id}', [DtsenController::class, 'update']);
    Route::delete('/dtsen/{id}', [DtsenController::class, 'destroy']);

    // Dashboard route
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/statistik-kabupaten-kota', [DashboardController::class, 'statistikKabupatenKota']);
});
