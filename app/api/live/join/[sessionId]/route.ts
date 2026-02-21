import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'
    if (!token) {
      return NextResponse.redirect(new URL('/login', baseUrl))
    }
    const payload = await verifyAccessToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/login', baseUrl))
    }

    const session = await prisma.liveSession.findUnique({
      where: { id: params.sessionId },
    })
    if (!session || !session.isLive || !session.zoomJoinUrl) {
      return NextResponse.json({ message: 'الجلسة غير متاحة أو انتهت' }, { status: 404 })
    }

    if (payload.role === 'ADMIN') {
      const redirect = session.zoomStartUrl || session.zoomJoinUrl
      return NextResponse.redirect(redirect)
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: payload.userId },
      orderBy: { enrolledAt: 'desc' },
    })
    if (!enrollment) {
      return NextResponse.json({ message: 'يجب الاشتراك في مادة أولاً' }, { status: 403 })
    }
    if (enrollment.expiresAt && new Date(enrollment.expiresAt) < new Date()) {
      return NextResponse.json({ message: 'انتهت صلاحية اشتراكك' }, { status: 403 })
    }
    const tierOk = enrollment.tier === 'FULL' || enrollment.tier === session.tier
    if (!tierOk) {
      return NextResponse.json({ message: 'مستواك لا يسمح بالانضمام لهذه المحاضرة' }, { status: 403 })
    }

    return NextResponse.redirect(session.zoomJoinUrl)
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
