import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })

    const body = await request.json()
    const { courseId, chapterId, title, tier, durationMinutes, isPreview } = body as {
      courseId: string
      chapterId?: string
      title: string
      tier?: string
      durationMinutes?: number
      isPreview?: boolean
    }
    if (!courseId || !title) {
      return NextResponse.json({ message: 'المادة والعنوان مطلوبان' }, { status: 400 })
    }

    const maxOrder = await prisma.lesson.aggregate({
      where: chapterId ? { chapterId } : { courseId, chapterId: null },
      _max: { orderIndex: true },
    })
    const orderIndex = (maxOrder._max.orderIndex ?? 0) + 1
    const lessonTier = tier === 'MID2' || tier === 'FINAL' || tier === 'FULL' ? tier : 'MID1'

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        chapterId: chapterId || null,
        title,
        tier: lessonTier,
        orderIndex,
        durationMinutes: durationMinutes ?? null,
        isPreview: Boolean(isPreview),
      },
    })
    return NextResponse.json({ lesson }, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
