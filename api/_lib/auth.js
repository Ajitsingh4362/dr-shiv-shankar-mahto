// Verifies Managed Better Auth (Neon Auth) JWTs sent from the frontend as
// `Authorization: Bearer <token>`. Use `requireAuth` inside any API route
// that only the logged-in admin should be able to call (POST/PUT/DELETE).
import * as jose from 'jose'

const NEON_AUTH_URL = process.env.NEON_AUTH_URL // e.g. https://ep-xxx.neon.tech/neondb/auth

let JWKS
function getJWKS() {
  if (!JWKS) {
    if (!NEON_AUTH_URL) throw new Error('NEON_AUTH_URL is not set on the server')
    JWKS = jose.createRemoteJWKSet(new URL(`${NEON_AUTH_URL}/.well-known/jwks.json`))
  }
  return JWKS
}

/**
 * Verifies the Bearer token on the request.
 * Returns the decoded JWT payload (contains `sub` = user id, `email`, etc).
 * Throws if missing/invalid — callers should catch and respond 401.
 */
export async function verifyRequestAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing Authorization header')
  }
  const token = authHeader.slice('Bearer '.length)
  const { payload } = await jose.jwtVerify(token, getJWKS(), {
    issuer: new URL(NEON_AUTH_URL).origin,
  })
  if (!payload.sub) throw new Error('Invalid token payload')
  return payload
}

/**
 * Small helper to wrap a Vercel serverless handler so it 401s automatically
 * if the request isn't authenticated. Use for any write (POST/PUT/DELETE)
 * that only the admin should be able to do.
 *
 *   export default async function handler(req, res) {
 *     if (req.method !== 'GET') {
 *       try { await verifyRequestAuth(req) } catch { return res.status(401).json({ error: 'Unauthorized' }) }
 *     }
 *     ...
 *   }
 */
export async function requireAuthOrRespond(req, res) {
  try {
    await verifyRequestAuth(req)
    return true
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
}
