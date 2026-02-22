import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })

    const materials = await prisma.material.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { chapters: true, lessons: true } },
      },
    })
    return NextResponse.json({ materials })
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

    const body = await request.json()
    const { title, slug, description, shortDescription, category, level, isPublished } = body as {
      title: string
      slug: string
      description?: string
      shortDescription?: string
      category?: string
      level?: string
      isPublished?: boolean
    }
    if (!title || !slug) {
      return NextResponse.json({ message: 'العنوان والرابط (slug) مطلوبان' }, { status: 400 })
    }
    const existing = await prisma.material.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ message: 'رابط المادة مستخدم مسبقاً' }, { status: 400 })

    const material = await prisma.material.create({
      data: {
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description || '',
        shortDescription: shortDescription || null,
        category: category || null,
        level: level === 'INTERMEDIATE' ? 'INTERMEDIATE' : level === 'ADVANCED' ? 'ADVANCED' : 'BEGINNER',
        isPublished: Boolean(isPublished),
      },
    })
    return NextResponse.json({ material }, { status: 201 })
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
