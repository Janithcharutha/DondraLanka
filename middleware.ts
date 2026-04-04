// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   // Basic middleware logic without auth
//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/admin/:path*',
//     '/api/admin/:path*',
//   ],
// }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // List of public auth routes
  const publicAuthRoutes = [
    '/admin/auth/login',
    '/admin/auth/register',
    '/admin/auth/forgot-password',
    '/admin/auth/reset-password'
  ]

  // Allow all non-admin routes
  if (!path.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow access to public auth routes
  if (publicAuthRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for auth token on protected admin routes
  const token = request.cookies.get('token')?.value

  // Redirect to login if no token found
  if (!token && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
}