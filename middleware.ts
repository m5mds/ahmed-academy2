import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessTokenFromRequest, getRefreshTokenFromRequest } from '@/lib/auth-server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // ─── Static assets — always pass through ────────────
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/uploads') ||
        pathname.startsWith('/manifest') ||
        pathname.startsWith('/sw.js')
    ) {
        return NextResponse.next()
    }

    // ─── API auth routes — always pass through ──────────
    if (pathname.startsWith('/api/auth')) return NextResponse.next()

    // ─── Webhooks — always pass through ─────────────────
    if (pathname.startsWith('/api/webhooks')) return NextResponse.next()

    // ─── Verify user from JWT or legacy token ───────────
    const user = await verifyAccessTokenFromRequest(request)
    const isLoggedIn = !!user
    const isAdmin = user?.role === 'ADMIN'

    // ─── Admin API routes — require admin role ──────────
    if (pathname.startsWith('/api/admin')) {
        if (!isAdmin) {
            return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })
        }
        return NextResponse.next()
    }

    // ─── Other API routes — pass through ────────────────
    if (pathname.startsWith('/api/')) return NextResponse.next()

    // ─── Public routes (no auth needed) ─────────────────
    const publicRoutes = ['/login', '/register', '/reset-password', '/forgot-password']
    const isPublicRoute =
        publicRoutes.some(route => pathname === route) ||
        pathname === '/' ||
        pathname.startsWith('/courses') ||
        pathname === '/privacy' ||
        pathname === '/terms'

    // ─── Admin pages — require admin role ───────────────
    if (pathname.startsWith('/admin')) {
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    // ─── Redirect logged-in users away from auth pages ──
    const authPages = ['/login', '/register', '/reset-password', '/forgot-password']
    const isAuthPage = authPages.some(route => pathname === route) || pathname === '/'
    if (isAuthPage && isLoggedIn) {
        if (isAdmin) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // ─── Block unauthenticated from protected routes ────
    if (!isPublicRoute && !isLoggedIn) {
        const loginUrl = new URL('/login', request.url)
        if (pathname !== '/') {
            loginUrl.searchParams.set('redirect', pathname)
        }
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|images|uploads).*)',
    ],
}
