// POST /api/upload
// Body: { fileName: string, contentType: string, folder: 'gallery' | 'blog' }
// Returns: { uploadUrl, publicUrl, key }
// Frontend then does: fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })
import { requireAuthOrRespond } from './_lib/auth.js'
import { createUploadUrl } from './_lib/r2.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!(await requireAuthOrRespond(req, res))) return

  try {
    const { fileName, contentType, folder } = req.body || {}
    if (!fileName || !contentType) {
      return res.status(400).json({ error: 'fileName and contentType are required' })
    }
    const safeFolder = ['gallery', 'blog', 'doctor', 'patients'].includes(folder) ? folder : 'misc'
    const ext = (fileName.split('.').pop() || 'jpg').toLowerCase()
    const key = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const result = await createUploadUrl(key, contentType)
    return res.status(200).json(result)
  } catch (err) {
    console.error('upload error', err)
    return res.status(500).json({ error: 'Failed to create upload URL' })
  }
}
