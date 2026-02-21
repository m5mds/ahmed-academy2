import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload) return NextResponse.json({ message: 'الجلسة منتهية' }, { status: 401 })

    const liveSessions = await prisma.liveSession.findMany({
      where: { isLive: true },
      orderBy: { startedAt: 'desc' },
    })

    let studentTier: string | null = null
    if (payload.role === 'STUDENT') {
      const enrollment = await prisma.enrollment.findFirst({
        where: { userId: payload.userId },
        orderBy: { enrolledAt: 'desc' },
      })
      if (enrollment) {
        const expired = enrollment.expiresAt && new Date(enrollment.expiresAt) < new Date()
        if (!expired) studentTier = enrollment.tier
      }
    }

    const list = liveSessions.map((s) => ({
      id: s.id,
      title: s.title,
      tier: s.tier,
      isLive: s.isLive,
      startedAt: s.startedAt,
      canJoin:
        payload.role === 'ADMIN' ||
        (payload.role === 'STUDENT' &&
          studentTier !== null &&
          (studentTier === 'FULL' || studentTier === s.tier)),
    }))

    return NextResponse.json({ sessions: list })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
