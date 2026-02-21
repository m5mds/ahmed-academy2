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

    const body = await request.json().catch(() => ({}))
    const { title, tier, durationMinutes, isPreview, chapterId } = body as {
      title?: string
      tier?: string
      durationMinutes?: number
      isPreview?: boolean
      chapterId?: string | null
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (tier !== undefined) updateData.tier = tier === 'MID2' || tier === 'FINAL' || tier === 'FULL' ? tier : 'MID1'
    if (durationMinutes !== undefined) updateData.durationMinutes = durationMinutes
    if (isPreview !== undefined) updateData.isPreview = Boolean(isPreview)
    if (chapterId !== undefined) updateData.chapterId = chapterId || null

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: updateData,
    })
    return NextResponse.json({ lesson })
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

    await prisma.lesson.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'تم حذف الدرس' })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
