import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Minimal middleware: no auth-server import (avoids Node/crypto in Edge and "Code generation from strings disallowed" on some Node versions).
// Auth is enforced in API routes and in page-level redirects.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|uploads).*)',
  ],
}
