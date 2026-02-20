<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Get user profile
     */
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()->toApiArray(),
        ], 200);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $request->user()->id,
            'avatar' => 'sometimes|string|nullable',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->toApiArray(),
        ], 200);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        // Verify current password
        if (!Hash::check($validated['currentPassword'], $user->password)) {
            throw ValidationException::withMessages([
                'currentPassword' => ['The current password is incorrect.'],
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['newPassword']),
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ], 200);
    }

    /**
     * List all users (Admin only)
     */
    public function index()
    {
        $users = \App\Models\User::all();

        return response()->json([
            'data' => $users->map(fn($user) => $user->toApiArray()),
            'total' => $users->count(),
        ], 200);
    }

    /**
     * Get user by ID (Admin only)
     */
    public function show($id)
    {
        $user = \App\Models\User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        return response()->json([
            'user' => $user->toApiArray(),
        ], 200);
    }

    /**
     * Update user (Admin only)
     */
    public function update(Request $request, $id)
    {
        $user = \App\Models\User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $id,
            'avatar' => 'sometimes|string|nullable',
            'balance' => 'sometimes|numeric|min:0',
            'level' => 'sometimes|string|max:255',
            'role' => 'sometimes|in:user,admin',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->toApiArray(),
        ], 200);
    }

    /**
     * Delete user (Admin only)
     */
    public function destroy($id)
    {
        $user = \App\Models\User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }
}
