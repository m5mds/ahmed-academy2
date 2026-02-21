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

    const locks = await prisma.contentLock.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ locks })
  } catch {
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

    const { scope, level, targetId, studentId, locked } = await request.json()

    if (!scope || !level || !targetId || locked === undefined) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const existing = await prisma.contentLock.findFirst({
      where: {
        scope,
        level,
        targetId,
        ...(scope === 'PER_STUDENT' ? { studentId } : {}),
      },
    })

    let lock
    if (existing) {
      lock = await prisma.contentLock.update({
        where: { id: existing.id },
        data: { locked, createdBy: payload.userId },
      })
    } else {
      lock = await prisma.contentLock.create({
        data: {
          scope,
          level,
          targetId,
          studentId: scope === 'PER_STUDENT' ? studentId : null,
          locked,
          createdBy: payload.userId,
        },
      })
    }

    await prisma.lockAudit.create({
      data: {
        adminId: payload.userId,
        studentId: scope === 'PER_STUDENT' ? studentId : null,
        level,
        scope,
        targetId,
        action: locked ? 'LOCK' : 'UNLOCK',
      },
    })

    return NextResponse.json({ lock })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
