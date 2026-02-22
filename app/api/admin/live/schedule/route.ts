import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
    const payload = await verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })

    const body = await request.json()
    const { title, date, time, tier } = body as { title: string; date: string; time: string; tier: string }
    if (!title || !date || !time || !tier) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة: title, date, time, tier' }, { status: 400 })
    }
    const sessionTier = tier === 'MID1' || tier === 'MID2' || tier === 'FINAL' ? tier : 'MID1'
    const scheduledAt = new Date(`${date}T${time}`)
    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ message: 'تاريخ أو وقت غير صالح' }, { status: 400 })
    }

    const session = await prisma.liveSession.create({
      data: {
        title,
        tier: sessionTier,
        isLive: false,
        scheduledAt,
      },
    })

    return NextResponse.json({ session, message: 'تم جدولة المحاضرة' }, { status: 201 })
  } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
