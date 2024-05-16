<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;
use Illuminate\Http\Request;
class Authenticate extends Middleware
{
   /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, ...$guards)
    {
        $cookieToken = $request->cookie('token');
  
        if ($cookieToken) {
            $request->headers->set('Authorization', 'Bearer ' . $cookieToken);
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized',"user"=>"eeee"], 401);
    }
}
