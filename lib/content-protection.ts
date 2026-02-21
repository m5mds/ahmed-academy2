import * as jose from 'jose'

const CLOUDFLARE_STREAM_KEY = process.env.CLOUDFLARE_STREAM_API_TOKEN || ''
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || ''

export async function generateSignedVideoUrl(mediaId: string): Promise<string> {
  const expiration = Math.floor(Date.now() / 1000) + 3600

  const token = await new jose.SignJWT({
    sub: mediaId,
    exp: expiration,
    kid: 'cloudflare-stream-key',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(CLOUDFLARE_STREAM_KEY))

  return `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${token}/iframe`
}
