import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes pattern
const protectedRoutes = [
  '/profile',
  '/cart',
  '/orders',
  '/orders/',
  '/wishlist',
  '/payments',
  '/address',
  '/returns',
  '/security-settings',
  '/notifications',
  '/warranty-claims',
  '/buyer-onboarding',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path starts with any of the protected routes
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    // Check for auth_token cookie
    const token = request.cookies.get('auth_token');

    if (!token) {
      console.log(`[Middleware] Redirecting to login. Path: ${pathname}`);
      console.log('[Middleware] Received Cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 10)}...`));

      // Redirect to login if token is missing
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);

      const response = NextResponse.redirect(loginUrl);
      response.headers.set('X-Middleware-Reason', 'missing_token');
      response.headers.set('X-Middleware-Debug-Cookies', request.cookies.getAll().map(c => c.name).join(','));
      return response;
    } else {
      // console.log(`[Middleware] Token found for ${pathname}`);
    }
  }

  const response = NextResponse.next();
  // Optional: Add debug header for success case (requires more complex logic for next(), usually skipped or done via intermediate response)
  // For now, we trust that if we get here, token was found or route wasn't protected.
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
