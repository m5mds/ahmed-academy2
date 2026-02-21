import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })

    const url = new URL(request.url)
    const courseId = url.searchParams.get('courseId')

    const courses = await prisma.course.findMany({
      where: courseId ? { id: courseId } : undefined,
      include: {
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
    })

    const locks = await prisma.contentLock.findMany({
      where: { scope: 'GLOBAL', locked: true },
    })

    return NextResponse.json({ courses, locks })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
