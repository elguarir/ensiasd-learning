<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use function is_null;

class EnsureProfileIsComplete
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */

    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && (is_null(Auth::user()->profile_completed_at) || is_null(Auth::user()->role))) {
            return redirect()->route('profile.setup');
        }
        return $next($request);
    }
}
