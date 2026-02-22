import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { slug: params.slug },
      include: {
        lessons: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    })

    if (!material) {
      return NextResponse.json({ message: 'المادة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json({ material })
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
