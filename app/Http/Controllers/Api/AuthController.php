<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogActivity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:pegawai,pelaku_usaha',
            'nip' => 'nullable|string|max:255',
            'no_telp' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'nip' => $request->role === 'pegawai' ? $request->nip : null,
        ]);

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'User baru terdaftar: ' . $user->role,
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 201);
    }

    /**
     * Attempt to login using existing users table
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Try to find user in the users table (from db_crawl_se)
        $user = \DB::table('users')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah'],
            ]);
        }

        // Get the full user model for Sanctum
        $userModel = User::find($user->id);

        // Create Sanctum token using the trait
        $token = $userModel->createToken('auth-token')->plainTextToken;

        // Log activity
        LogActivity::create([
            'name' => $user->name,
            'email' => $user->email,
            'activity_log' => 'User login ke sistem',
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nip' => $user->nip ?? null,
                'role' => $user->role ?? 'pegawai',
            ],
            'token' => $token,
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Log activity before logout
        if ($user) {
            LogActivity::create([
                'name' => $user->name,
                'email' => $user->email,
                'activity_log' => 'User logout dari sistem',
                'timestamp' => now(),
            ]);
        }

        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }
}
