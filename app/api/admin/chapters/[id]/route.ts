import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })

    const { title, tier } = await request.json()

    const chapter = await prisma.chapter.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(tier && { tier }),
      },
      include: { lessons: true },
    })

    if (tier) {
      await prisma.lesson.updateMany({
        where: { chapterId: params.id },
        data: { tier },
      })
    }

    return NextResponse.json({ chapter })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })

    await prisma.chapter.delete({ where: { id: params.id } })

    return NextResponse.json({ message: 'تم حذف الفصل' })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
