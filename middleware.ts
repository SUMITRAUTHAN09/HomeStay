import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('🔍 Middleware checking path:', path);

  // ✅ PUBLIC PAGES - Skip auth check
  const publicPages = [
    '/',
    '/login',
    '/forgotpassword',
    '/verify-otp',
    '/resetpassword' 
  ];

  if (publicPages.includes(path)) {
    console.log('✅ Public page - allowing');
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('adminToken')?.value;
  console.log('🔍 Token exists:', !!token);

  // ✅ Protect admin routes
  const isAdminRoute = path.startsWith('/admin');
  if (isAdminRoute) {
    if (!token) {
      console.log('🔒 Redirecting to login - no token');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('✅ Allowing access to admin route');
    return NextResponse.next();
  }

  // Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match ALL paths except API/static - catches resetpassword!
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
