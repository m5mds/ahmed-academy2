import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkLessonAccess } from '@/lib/access-control'
import { generateSignedVideoUrl } from '@/lib/content-protection'

// Institutional Level Content Security Protocol
// Order: 1. JWT 2. Subscription 3. Unlock 4. Global Lock 5. Tier entitlement
export async function GET(
  _request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) {
      return NextResponse.json({ message: 'UNAUTHORIZED: Identity token missing.' }, { status: 401 })
    }

    const payload = await verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ message: 'SESSION EXPIRED: Re-authentication required.' }, { status: 401 })
    }

    // Comprehensive Access Matrix Check
    const accessResult = await checkLessonAccess(payload.userId, params.lessonId)

    if (!accessResult.allowed) {
      return NextResponse.json({ message: accessResult.reason || 'ACCESS RESTRICTED: Institutional policy enforced.' }, { status: 403 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
    })

    if (!lesson?.videoUrl) {
      return NextResponse.json({ message: 'RESOURCE NOT FOUND: Media identifier unavailable.' }, { status: 404 })
    }

    // JWS URL Generation for Cloudflare Stream
    const signedUrl = await generateSignedVideoUrl(lesson.videoUrl)

    return NextResponse.json({
      signedUrl,
      trackingId: `SECURE-VID-${params.lessonId}-${Date.now()}`
    })
  } catch (error) {
    console.error('Content Security Error:', error)
    return NextResponse.json({ message: 'SYSTEM ERROR: Secure stream synthesis failed.' }, { status: 500 })
  }
}
