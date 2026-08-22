<?php

use App\Http\Controllers\AdminStatsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FleetController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);
Route::get('/cars/{car}/reviews', [ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);

    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);
    Route::post('/reservations/{reservation}/payments', [PaymentController::class, 'store']);

    Route::post('/cars/{car}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    Route::get('/conversation', [MessageController::class, 'show']);
    Route::post('/conversation', [MessageController::class, 'store']);

    Route::middleware('admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::post('/cars', [CarController::class, 'store']);
        Route::put('/cars/{car}', [CarController::class, 'update']);
        Route::delete('/cars/{car}', [CarController::class, 'destroy']);

        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

        Route::put('/payments/{payment}', [PaymentController::class, 'update']);

        Route::get('/admin/stats', [AdminStatsController::class, 'index']);

        Route::get('/admin/fleet', [FleetController::class, 'index']);
        Route::get('/admin/cars/{car}/movements', [FleetController::class, 'movements']);
        Route::post('/admin/cars/{car}/mark-available', [FleetController::class, 'markAvailable']);

        Route::get('/admin/conversations', [MessageController::class, 'adminIndex']);
        Route::get('/admin/conversations/{client}', [MessageController::class, 'adminShow']);
        Route::post('/admin/conversations/{client}', [MessageController::class, 'adminStore']);
    });
});
