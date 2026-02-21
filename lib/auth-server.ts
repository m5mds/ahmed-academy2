import { NextRequest } from 'next/server'
import { verifyAccessToken, JWTPayload } from './auth'

export async function verifyAccessTokenFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    return verifyAccessToken(token)
  }

  const token = request.cookies.get('access_token')?.value
  if (token) {
    return verifyAccessToken(token)
  }

  return null
}

export function getRefreshTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get('refresh_token')?.value || null
}
