<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PrelistController;
use App\Http\Controllers\Api\SnowballController;
use App\Http\Controllers\Api\LogActivityController;
use App\Http\Controllers\Api\UserController;

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
    
    // Prelist routes (CRUD)
    Route::get('/prelist', [PrelistController::class, 'index']);
    Route::post('/prelist', [PrelistController::class, 'store']);
    Route::get('/prelist/{id}', [PrelistController::class, 'show']);
    Route::put('/prelist/{id}', [PrelistController::class, 'update']);
    Route::delete('/prelist/{id}', [PrelistController::class, 'destroy']);
    
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
});
