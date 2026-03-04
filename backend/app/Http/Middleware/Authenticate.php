<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Se for uma requisição JSON (API), não redireciona
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        
        // Para requisições web, retorna null também já que não temos rota login
        return null;
    }
}
