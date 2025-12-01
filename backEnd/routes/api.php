<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\VehicleController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);

// Protected Routes (Logged in Users)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Reservation (User)
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::get('/my-reservations/{id}', [ReservationController::class, 'show']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

    // Admin Routes
    Route::middleware('admin')->group(function () {
        // Vehicle CRUD
        Route::post('/vehicles', [VehicleController::class, 'store']);
        Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
        Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

        // Admin Reservations
        Route::get('/admin/reservations', [ReservationController::class, 'index']);
        Route::put('/admin/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

        // Stats
        Route::get('/admin/stats', [DashboardController::class, 'stats']);
    });
});
