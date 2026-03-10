<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * 
     * Usage: role:admin,pegawai,pelaku_usaha
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles Comma-separated list of allowed roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            // For API routes, return JSON response
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
            return redirect('/login');
        }

        $userRole = $request->user()->role;
        
        // Parse allowed roles
        $allowedRoles = array_map('trim', explode(',', $roles));
        
        // Check if user role is in the allowed list
        if (!in_array($userRole, $allowedRoles)) {
            // Redirect to home if user doesn't have required role
            return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        }

        return $next($request);
    }
}
