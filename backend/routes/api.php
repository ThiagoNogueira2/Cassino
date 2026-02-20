<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Velvet Stake Hub API is running!',
        'timestamp' => now(),
    ]);
});

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    
    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Protected user routes
Route::middleware('auth:sanctum')->prefix('users')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::put('/change-password', [UserController::class, 'changePassword']);
});

// Fallback for backward compatibility
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user()->toApiArray());
});

