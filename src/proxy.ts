import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Enhanced middleware combining authentication and security headers
 */
export default withAuth(
    function middleware(request: NextRequest) {
        const startTime = Date.now();
        const requestId = crypto.randomUUID();
        
        // Log incoming request
        console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - RequestID: ${requestId}`);
        
        const response = NextResponse.next();
        
        // Security Headers
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        
        // Content Security Policy
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com;"
        );
        
        // Request tracking
        response.headers.set('X-Request-ID', requestId);
        response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
        
        return response;
    },
    {
        pages: {
            signIn: "/login",
        },
        secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_now",
    }
);

export const config = {
    matcher: [
        "/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|login|manifest.json).*)",
    ],
};
