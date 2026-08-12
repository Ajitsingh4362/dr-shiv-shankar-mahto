// /api/gallery
// GET            -> list visible gallery items (public)
// GET ?all=1     -> list all items incl. hidden (admin, for the dashboard)
// POST           -> create item (admin)
// PUT  ?id=...   -> update item (admin)
// DELETE ?id=... -> delete item (admin)
import { sql } from './_lib/db.js'
import { requireAuthOrRespond } from './_lib/auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const showAll = req.query.all === '1'
      const rows = showAll
        ? await sql`select * from gallery order by sort_order asc, created_at desc`
        : await sql`select * from gallery where visible = true order by sort_order asc, created_at desc`
      return res.status(200).json(rows)
    }

    if (!(await requireAuthOrRespond(req, res))) return

    if (req.method === 'POST') {
      const { title, image_url, category, sort_order, visible } = req.body || {}
      if (!image_url) return res.status(400).json({ error: 'image_url is required' })
      const [row] = await sql`
        insert into gallery (title, image_url, category, sort_order, visible)
        values (${title || null}, ${image_url}, ${category || null}, ${sort_order ?? 0}, ${visible ?? true})
        returning *`
      return res.status(201).json(row)
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      const { title, image_url, category, sort_order, visible } = req.body || {}
      const [row] = await sql`
        update gallery set
          title = coalesce(${title}, title),
          image_url = coalesce(${image_url}, image_url),
          category = coalesce(${category}, category),
          sort_order = coalesce(${sort_order}, sort_order),
          visible = coalesce(${visible}, visible)
        where id = ${id}
        returning *`
      return res.status(200).json(row)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      await sql`delete from gallery where id = ${id}`
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('gallery api error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
