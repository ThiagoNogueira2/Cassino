<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'cpf' => 'required|string|unique:users|regex:/^\d{3}\.\d{3}\.\d{3}-\d{2}$/',
            'password' => 'required|string|min:6',
        ], [
            'cpf.regex' => 'O CPF deve estar no formato 000.000.000-00',
            'email.unique' => 'Este email já está cadastrado',
            'cpf.unique' => 'Este CPF já está cadastrado',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'cpf' => $validated['cpf'],
            'password' => Hash::make($validated['password']),
            'avatar' => null,
            'balance' => 0,
            'level' => 'VIP Silver',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user->toApiArray(),
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'rememberMe' => 'nullable|boolean',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->toApiArray(),
            'token' => $token,
        ], 200);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->toApiArray(),
        ], 200);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }

    /**
     * Send password reset email
     */
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            // Don't reveal if user exists or not for security
            return response()->json([
                'message' => 'If an account with that email exists, a password reset link has been sent.',
            ], 200);
        }

        // TODO: Implement password reset token generation and email sending
        // For now, return a placeholder response

        return response()->json([
            'message' => 'Password reset link sent to email',
        ], 200);
    }

    /**
     * Reset password with token
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'newPassword' => 'required|string|min:6|confirmed',
        ]);

        // TODO: Implement password reset token verification and update
        // For now, return a placeholder response

        return response()->json([
            'message' => 'Password reset successfully',
        ], 200);
    }

    /**
     * Refresh token (if using JWT with refresh tokens)
     */
    public function refreshToken(Request $request)
    {
        $validated = $request->validate([
            'refreshToken' => 'required|string',
        ]);

        // TODO: Implement refresh token logic
        // For now, return a placeholder response

        return response()->json([
            'message' => 'Token refreshed successfully',
            'token' => 'new_token_here',
        ], 200);
    }
}
