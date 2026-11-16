<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\ActivityLog;

class LogActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // We primarily want to log state-changing actions (POST, PUT, DELETE)
        // Let's exclude some generic, noisy routes or GET routes
        if ($request->isMethod('GET') || $request->isMethod('OPTIONS') || $request->is('api/logs*')) {
            return $response;
        }

        try {
            ActivityLog::create([
                'user_id' => $request->user() ? $request->user()->id : null,
                'action' => $request->method() . ' ' . $request->path(),
                'description' => json_encode($request->except(['password', 'password_confirmation'])),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
        } catch (\Exception $e) {
            // Ignore failure to log to prevent breaking the application
        }

        return $response;
    }
}
