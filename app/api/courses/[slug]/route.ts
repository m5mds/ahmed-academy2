import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        lessons: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    })

    if (!course) {
      return NextResponse.json({ message: 'الدورة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
