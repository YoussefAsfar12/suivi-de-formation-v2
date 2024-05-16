<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function getNotifications()
    {   
        $user = Auth::guard('api')->user();
        $notifications = $user->notifications;
        return response()->json(['notifications' => $notifications]);
    }

    public function markAsRead(Request $request, $id)
    {
        try {
            if (Auth::guard('api')->check()) {
                $notification = Notification::find($id);
                if (!$notification) {
                    return response()->json(['error' => 'Notification not found.'], 404);
                }
                $notification->read = true;
                $notification->save();
                return response()->json(['message' => 'Notification marked as read successfully.']);
            } else {
                return response()->json(['error' => 'User not authenticated.'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function unreadNotifications()
    {
        try {
            $user = null;
    
            if (Auth::guard('api')->check()) {
                $user = Auth::guard('api')->user();
            } 
            if ($user) {
                $unreadNotifications = Notification::where('user_id', $user->id)
                    ->unread()
                    ->with('user')
                    ->orderBy('created_at', 'desc')
                    ->get();
                return response()->json($unreadNotifications);
            } else {
                return response()->json(['error' => 'User not authenticated.'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function resetUnreadNotifications(Request $request)
    {   

        try {
            $user = null;
    
            if (Auth::guard('api')->check()) {
                $user = Auth::guard('api')->user();
                $seller = User::where('id', $user->id)->first();
                $seller->unread_notifications = 0;
                $seller->save();
            } 
            return response()->json(['message' => 'Unread notifications count reset to 0 successfully'], 200);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
     
    }
}
