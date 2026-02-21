import { NextResponse } from 'next/server'
import { verifyAccessTokenFromRequest } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { generateSignedVideoUrl, checkTierAccess } from '@/lib/content-protection'

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const userPayload = await verifyAccessTokenFromRequest(request as any)
    if (!userPayload) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: { course: true }
    })

    if (!lesson) {
      return NextResponse.json({ message: 'الدرس غير موجود' }, { status: 404 })
    }

    // Check enrollment and tier
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userPayload.userId,
          courseId: lesson.courseId
        }
      }
    })

    if (!enrollment && !lesson.isPreview) {
      return NextResponse.json({ message: 'يجب الاشتراك في الدورة أولاً' }, { status: 403 })
    }

    if (enrollment && !checkTierAccess(enrollment.tier, lesson.tier)) {
      return NextResponse.json({ message: 'مستواك الحالي لا يسمح بالوصول لهذا الدرس' }, { status: 403 })
    }

    const signedUrl = await generateSignedVideoUrl(lesson.videoUrl || '')
    
    return NextResponse.json({ signedUrl })
  } catch (error) {
    return NextResponse.json({ message: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
