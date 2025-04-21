import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define protected routes
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/settings')

  // Get the access token from cookies
  const accessToken = request.cookies.get('access_token')

  // If it's a protected route and there's no access token, redirect to login
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is on login/register page and has access token, redirect to dashboard
  if ((path === '/login' || path === '/register') && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login', '/register']
} 