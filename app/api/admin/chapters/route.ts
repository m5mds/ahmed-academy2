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
    const materialId = url.searchParams.get('materialId')

    const chapters = await prisma.chapter.findMany({
      where: materialId ? { materialId } : undefined,
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: { orderBy: { orderIndex: 'asc' } },
      },
    })

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })

    const { materialId, title, tier } = await request.json()

    if (!materialId || !title || !tier) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const maxOrder = await prisma.chapter.aggregate({
      where: { materialId },
      _max: { orderIndex: true },
    })

    const chapter = await prisma.chapter.create({
      data: {
        materialId,
        title,
        tier,
        orderIndex: (maxOrder._max.orderIndex ?? 0) + 1,
      },
      include: { lessons: true },
    })

    return NextResponse.json({ chapter }, { status: 201 })
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
