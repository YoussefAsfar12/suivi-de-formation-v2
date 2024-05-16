<?php

use App\Events\NotificationCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\NotificationController;
use App\Models\Notification;







Route::get('/formateurs', [UserController::class, 'getFormateurs']);
Route::get('/participants', [UserController::class, 'getParticipants']);



Route::get('/formateurs', [UserController::class, 'getFormateur']);
Route::get('/participants', [UserController::class, 'getParticipant']);
Route::post('/users', [UserController::class, 'store']);
Route::post('/users/login', [UserController::class, 'login']);
Route::get('/users/by-email', [UserController::class, 'getByEmail']);
Route::get('/users/by-titre', [UserController::class, 'getByTitre']);
Route::get('/users/by-name', [UserController::class, 'getByName']);
Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/by-titre', [FormationController::class, 'getByTitre']);

Route::middleware('auth')->group(function () {

Route::get('/get-token', function () {
    return response()->json( ["token"=>  request()->cookie('token')]);
});

    Route::get('/users/current-user', [UserController::class, 'getCurrentUser']);
    Route::get('/users/logout', [UserController::class, 'logout']);
    Route::post('/formations', [FormationController::class, 'store']);
    Route::post('/certifications', [CertificationController::class, 'store']);
    Route::post('/formations/{formationId}/comment', [EvaluationController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/formations/{id}', [FormationController::class, 'destroy']);
    Route::put('/formations/{id}', [FormationController::class, 'update']);
    Route::post('/formations/{formationId}/enroll/{participantId}', [FormationController::class, 'enrollParticipant']);
    Route::get('/formations/{formationId}/{participantId}/isEnrolled', [FormationController::class, 'isEnrolled']);
    
});


Route::get('/users/{id}', [UserController::class, 'getUser']);
Route::get('/formations/{id}', [FormationController::class, 'getFormation']);
Route::get('/formations/{formationId}/participants', [FormationController::class, 'participants']);
Route::get('/participants/{userId}/formations', [FormationController::class, 'formationsByParticipant']);
Route::get('/formateurs/{userId}/formations', [FormationController::class, 'formationsByFormateur']);

Route::get('/users/{userId}/certifications', [CertificationController::class, 'certificationsByParticipant']);

Route::get('/formations/{formationId}/evaluations', [EvaluationController::class, 'evaluationsByFormation']);


Route::prefix('notifications')->group(function () {

    Route::middleware('auth')->group(function () {
        Route::get('/', [NotificationController::class, 'getNotifications']);
        Route::get('/unread', [NotificationController::class, 'unreadNotifications']);
        Route::patch('/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
        Route::patch('/reset-unread-notifications', [NotificationController::class, 'resetUnreadNotifications']);
    });


});







// Route::get('/fire-event', function () {
//     $notification = Notification::all()->last();
//     event(new NotificationCreated( $notification ));
//     return 'ok';
// });


