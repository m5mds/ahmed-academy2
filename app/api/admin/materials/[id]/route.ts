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
    const { title, slug, description, shortDescription, category, level, isPublished } = body as {
      title?: string
      slug?: string
      description?: string
      shortDescription?: string
      category?: string
      level?: string
      isPublished?: boolean
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase().replace(/\s+/g, '-')
    if (description !== undefined) updateData.description = description
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription
    if (category !== undefined) updateData.category = category
    if (level !== undefined) updateData.level = level === 'INTERMEDIATE' ? 'INTERMEDIATE' : level === 'ADVANCED' ? 'ADVANCED' : 'BEGINNER'
    if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished)

    const material = await prisma.material.update({
      where: { id: params.id },
      data: updateData,
    })
    return NextResponse.json({ material })
  } catch (error) {
    console.error("[API Error]", error);
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

    await prisma.material.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'تم حذف المادة' })
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
