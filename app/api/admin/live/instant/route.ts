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

    const body = await request.json().catch(() => ({}))
    const { title, tier, zoomJoinUrl: pastedJoinUrl } = body as { title?: string; tier?: string; zoomJoinUrl?: string }
    const sessionTier = tier === 'MID1' || tier === 'MID2' || tier === 'FINAL' ? tier : 'MID1'

    let zoomJoinUrl: string | null = pastedJoinUrl && pastedJoinUrl.startsWith('http') ? pastedJoinUrl : null
    let zoomMeetingId: string | null = null
    const zoomAccountId = process.env.ZOOM_ACCOUNT_ID
    const zoomClientId = process.env.ZOOM_CLIENT_ID
    const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET

    if (!zoomJoinUrl && zoomAccountId && zoomClientId && zoomClientSecret) {
      try {
        const authRes = await fetch(
          `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${Buffer.from(`${zoomClientId}:${zoomClientSecret}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        const authData = await authRes.json()
        const accessToken = authData.access_token
        if (accessToken) {
          const meetingRes = await fetch('https://api.zoom.us/v2/users/me/meetings', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              topic: title || `فصل مباشر - ${sessionTier}`,
              type: 1,
              settings: { join_before_host: false },
            }),
          })
          const meetingData = await meetingRes.json()
          if (meetingData.join_url) {
            zoomJoinUrl = meetingData.join_url
            zoomMeetingId = String(meetingData.id ?? '')
          }
        }
      } catch {
        // fallback: admin can set link manually
      }
    }

    const session = await prisma.liveSession.create({
      data: {
        title: title || `فصل مباشر - ${sessionTier}`,
        tier: sessionTier,
        isLive: true,
        zoomMeetingId,
        zoomJoinUrl: zoomJoinUrl || undefined,
        startedAt: new Date(),
      },
    })

    return NextResponse.json({ session, message: 'تم بدء البث المباشر' }, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
  }
}
