import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
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

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: payload.userId },
      include: {
        material: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            level: true,
          },
        },
      },
    })

    const completedCourses = enrollments.filter(
      (e) => Number(e.progress) >= 100
    ).length

    return NextResponse.json({
      enrollments,
      totalCourses: enrollments.length,
      completedCourses,
    })
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
