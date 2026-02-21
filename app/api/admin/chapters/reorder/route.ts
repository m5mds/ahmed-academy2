import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })

    const { orderedIds } = await request.json()

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ message: 'بيانات غير صالحة' }, { status: 400 })
    }

    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        prisma.chapter.update({
          where: { id },
          data: { orderIndex: index + 1 },
        })
      )
    )

    return NextResponse.json({ message: 'تم إعادة الترتيب' })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
