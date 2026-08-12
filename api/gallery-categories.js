// /api/gallery-categories
// GET            -> list categories (public)
// POST           -> create category (admin)  body: { name, slug }
// DELETE ?id=... -> delete category (admin)
import { sql } from './_lib/db.js'
import { requireAuthOrRespond } from './_lib/auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await sql`select * from gallery_categories order by sort_order asc, name asc`
      return res.status(200).json(rows)
    }

    if (!(await requireAuthOrRespond(req, res))) return

    if (req.method === 'POST') {
      const { name, slug, sort_order } = req.body || {}
      if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' })
      const [row] = await sql`
        insert into gallery_categories (name, slug, sort_order)
        values (${name}, ${slug}, ${sort_order ?? 0})
        returning *`
      return res.status(201).json(row)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      await sql`delete from gallery_categories where id = ${id}`
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('gallery-categories api error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
