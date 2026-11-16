<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\FeeController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'profile']);
    });
});

// Academic Structure (Public for now during frontend dev)
Route::apiResource('subjects', SubjectController::class);
Route::apiResource('classes', ClassController::class);
Route::apiResource('sections', SectionController::class);

// User & Student Management (Public for now during frontend dev)
Route::apiResource('teachers', TeacherController::class);
Route::apiResource('students', StudentController::class);

// Fees Management (Public for now during frontend dev)
Route::get('fees/upcoming', [FeeController::class, 'upcoming']);
Route::get('fees/search', [FeeController::class, 'search']);
Route::post('fees/deposit', [FeeController::class, 'deposit']);
Route::get('fees/structure', [FeeController::class, 'structure']);

Route::middleware('auth:sanctum')->group(function () {
    // Developer API
    Route::get('/developer/logs', [\App\Http\Controllers\Api\DeveloperController::class, 'logs']);
    Route::post('/developer/impersonate', [\App\Http\Controllers\Api\DeveloperController::class, 'impersonate']);
    Route::get('/developer/users', [\App\Http\Controllers\Api\DeveloperController::class, 'users']);
});

