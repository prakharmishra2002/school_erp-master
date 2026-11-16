<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ActivityLog;

class DeveloperController extends Controller
{
    /**
     * Get system activity logs.
     */
    public function logs(Request $request)
    {
        // Simple authorization check for developer
        if ($request->user()->role !== 'developer') {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        $logs = ActivityLog::with('user:id,name,role,email')
            ->orderBy('id', 'desc')
            ->paginate(50);

        return response()->json($logs);
    }

    /**
     * Generate an access token to impersonate any user.
     */
    public function impersonate(Request $request)
    {
        if ($request->user()->role !== 'developer') {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $targetUser = User::find($request->user_id);

        if (!$targetUser) {
            return response()->json(['message' => 'Target user not found.'], 404);
        }

        $token = $targetUser->createToken('impersonation-token')->plainTextToken;

        // Log the impersonation action explicitly
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'impersonate_user',
            'description' => json_encode(['target_user_id' => $targetUser->id, 'target_role' => $targetUser->role]),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'message' => 'Impersonation successful',
            'token' => $token,
            'user' => $targetUser
        ]);
    }

    /**
     * Get list of all users for developer to choose whom to impersonate.
     */
    public function users(Request $request)
    {
        if ($request->user()->role !== 'developer') {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Return users with basic info for dropdown selection
        $users = User::select('id', 'name', 'email', 'role')->orderBy('role')->orderBy('name')->get();

        return response()->json($users);
    }
}
