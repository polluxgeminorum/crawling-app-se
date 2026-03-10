<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticateSanctum
{
    /**
     * Handle an incoming request.
     * Checks for Sanctum token in Authorization header for web routes
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            // Check if token is in query string (for easier debugging)
            $token = $request->query('token');
        }
        
        if ($token) {
            // Find the token
            $accessToken = PersonalAccessToken::findToken($token);
            
            if ($accessToken) {
                // Set the user on the request
                $request->setUserResolver(function () use ($accessToken) {
                    return $accessToken->tokenable;
                });
                
                return $next($request);
            }
        }
        
        // No valid token - redirect to login
        return redirect('/login');
    }
}
