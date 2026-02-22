import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect /admin and /api/admin routes
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const token = request.cookies.get('access_token')?.value

    if (!token) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret')
      const { payload } = await jose.jwtVerify(token, secret)

      if (payload.role !== 'ADMIN') {
        if (path.startsWith('/api/')) {
          return NextResponse.json({ message: 'ممنوع الوصول' }, { status: 403 })
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      console.error('[Middleware Error]', error)
      if (path.startsWith('/api/')) {
        return NextResponse.json({ message: 'جلسة غير صالحة' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|uploads).*)',
  ],
}
