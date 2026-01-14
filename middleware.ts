import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes pattern
const protectedRoutes = [
  '/profile',
  '/cart',
  '/checkout',
  '/orders',
  '/wishlist',
  '/payments',
  '/address',
  '/returns',
  '/security-settings',
  '/notifications',
  '/warranty-claims',
  '/vendor/dashboard', // Assuming specific vendor routes are protected
  '/vendor/products',
  '/vendor/orders',
  '/vendor/settings',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path starts with any of the protected routes
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    // Check for auth_token cookie
    const token = request.cookies.get('auth_token');

    if (!token) {
      // Redirect to login if token is missing
      const loginUrl = new URL('/login', request.url);
      // Optional: Add return URL to redirect back after login
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
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
