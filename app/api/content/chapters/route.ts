import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getContentLockStatus } from '@/lib/access-control'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    }

    const payload = await verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ message: 'الجلسة منتهية' }, { status: 401 })
    }

    const url = new URL(request.url)
    const materialId = url.searchParams.get('materialId')

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: payload.userId },
      include: { material: true },
    })

    if (enrollments.length === 0) {
      return NextResponse.json({ grouped: { MID1: [], MID2: [], FINAL: [] }, enrollment: null, materials: [] })
    }

    const targetCourseId = materialId && materialId !== 'all'
      ? materialId
      : enrollments[0].materialId

    const enrollment = enrollments.find(e => e.materialId === targetCourseId) || enrollments[0]

    const isExpired = enrollment.expiresAt
      ? new Date(enrollment.expiresAt) < new Date()
      : false

    const chapters = await prisma.chapter.findMany({
      where: { materialId: targetCourseId },
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: { orderBy: { orderIndex: 'asc' } },
      },
    })

    const chaptersWithAccess = await Promise.all(
      chapters.map(async (chapter) => {
        const lessonsWithAccess = await Promise.all(
          chapter.lessons.map(async (lesson) => {
            const lockStatus = await getContentLockStatus(
              payload.userId,
              lesson.id,
              lesson.tier,
              lesson.chapterId,
              enrollment.tier,
              isExpired
            )
            return {
              id: lesson.id,
              title: lesson.title,
              durationMinutes: lesson.durationMinutes,
              isPreview: lesson.isPreview,
              tier: lesson.tier,
              locked: lockStatus.locked,
              lockReason: lockStatus.reason,
            }
          })
        )
        return {
          id: chapter.id,
          title: chapter.title,
          tier: chapter.tier,
          orderIndex: chapter.orderIndex,
          lessons: lessonsWithAccess,
        }
      })
    )

    const grouped = {
      MID1: chaptersWithAccess.filter((c) => c.tier === 'MID1'),
      MID2: chaptersWithAccess.filter((c) => c.tier === 'MID2'),
      FINAL: chaptersWithAccess.filter((c) => c.tier === 'FINAL'),
    }

    return NextResponse.json({
      grouped,
      enrollment: { tier: enrollment.tier, expiresAt: enrollment.expiresAt },
      materials: enrollments.map(e => ({ id: e.materialId, title: e.material.title })),
    })
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
