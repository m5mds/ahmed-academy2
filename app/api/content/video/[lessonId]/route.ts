import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkLessonAccess } from '@/lib/access-control'
import { generateSignedVideoUrl } from '@/lib/content-protection'

export async function GET(
  _request: Request,
  { params }: { params: { lessonId: string } }
) {
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

    const accessResult = await checkLessonAccess(payload.userId, params.lessonId)

    if (!accessResult.allowed) {
      return NextResponse.json({ message: accessResult.reason }, { status: 403 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
    })

    if (!lesson?.videoUrl) {
      return NextResponse.json({ message: 'لا يوجد فيديو لهذا الدرس' }, { status: 404 })
    }

    const signedUrl = await generateSignedVideoUrl(lesson.videoUrl)

    return NextResponse.json({ signedUrl })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
