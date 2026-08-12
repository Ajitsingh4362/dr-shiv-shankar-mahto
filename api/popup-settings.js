// /api/popup-settings
// GET  -> get the (single) popup settings row (public)
// PUT  -> update it (admin)
import { sql } from './_lib/db.js'
import { requireAuthOrRespond } from './_lib/auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const [row] = await sql`select * from popup_settings order by updated_at desc limit 1`
      return res.status(200).json(row || null)
    }

    if (!(await requireAuthOrRespond(req, res))) return

    if (req.method === 'PUT') {
      const { id, enabled, title, message, delay_ms } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id is required' })
      const [row] = await sql`
        update popup_settings set
          enabled = coalesce(${enabled}, enabled),
          title = coalesce(${title}, title),
          message = coalesce(${message}, message),
          delay_ms = coalesce(${delay_ms}, delay_ms),
          updated_at = now()
        where id = ${id}
        returning *`
      return res.status(200).json(row)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('popup-settings api error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
