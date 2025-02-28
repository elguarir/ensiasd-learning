<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileIsComplete
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */

    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && is_null(Auth::user()->profile_completed_at)) {
            return redirect()->route('profile.create');
        }
        return $next($request);
    }
}
