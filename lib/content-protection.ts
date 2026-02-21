import * as jose from 'jose'

const CLOUDFLARE_STREAM_KEY = process.env.CLOUDFLARE_STREAM_API_TOKEN || ''
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || ''

export async function generateSignedVideoUrl(mediaId: string): Promise<string> {
  // In a real implementation, this would use Cloudflare's signing key
  // For now, we'll return a placeholder that includes a JWS-like signature
  const expiration = Math.floor(Date.now() / 1000) + 3600
  
  const token = await new jose.SignJWT({
    sub: mediaId,
    exp: expiration,
    kid: 'cloudflare-stream-key'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(CLOUDFLARE_STREAM_KEY))

  return `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${token}/iframe`
}

export function checkTierAccess(userTier: string, lessonTier: string): boolean {
  const tiers = ['MID1', 'MID2', 'FINAL', 'FULL']
  const userIdx = tiers.indexOf(userTier)
  const lessonIdx = tiers.indexOf(lessonTier)
  
  if (userTier === 'FULL') return true
  if (lessonTier === userTier) return true
  
  return false
}
