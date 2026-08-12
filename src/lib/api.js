// Small fetch wrapper for calling our own /api/* serverless functions.
// Automatically attaches the Neon Auth Bearer token when a session exists,
// so admin (write) calls are authenticated. Public GETs work with no token.
import { authClient } from './authClient'

async function getAuthHeader() {
  try {
    const { data } = await authClient.getSession()
    const token = data?.session?.token
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

async function request(path, options = {}) {
  const authHeader = await getAuthHeader()
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try { const body = await res.json(); if (body?.error) message = body.error } catch {}
    throw new Error(message)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}

/**
 * Uploads a file to Cloudflare R2 via a signed URL from /api/upload,
 * and returns the public URL to store in the DB.
 * folder: 'gallery' | 'blog' | 'doctor' | 'patients'
 */
export async function uploadImage(file, folder = 'misc') {
  const { uploadUrl, publicUrl } = await api.post('/api/upload', {
    fileName: file.name,
    contentType: file.type,
    folder,
  })
  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!putRes.ok) throw new Error('Image upload to storage failed')
  return publicUrl
}
