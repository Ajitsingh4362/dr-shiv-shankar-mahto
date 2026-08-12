// /api/testimonials
// GET            -> list visible testimonials (public)
// GET ?all=1     -> list all testimonials incl. hidden (admin)
// POST           -> create testimonial (admin)
// PUT  ?id=...   -> update testimonial (admin)
// DELETE ?id=... -> delete testimonial (admin)
import { sql } from './_lib/db.js'
import { requireAuthOrRespond } from './_lib/auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const showAll = req.query.all === '1'
      const featuredOnly = req.query.featured === '1'
      let rows
      if (showAll) {
        rows = await sql`select * from testimonials order by sort_order asc, created_at desc`
      } else if (featuredOnly) {
        rows = await sql`select * from testimonials where visible = true and featured = true order by sort_order asc, created_at desc`
      } else {
        rows = await sql`select * from testimonials where visible = true order by sort_order asc, created_at desc`
      }
      return res.status(200).json(rows)
    }

    if (!(await requireAuthOrRespond(req, res))) return

    if (req.method === 'POST') {
      const { name, rating, program, location, avatar_color, photo_url, review, sort_order, visible, featured } = req.body || {}
      if (!name || !review) return res.status(400).json({ error: 'name and review are required' })
      const [row] = await sql`
        insert into testimonials (name, rating, program, location, avatar_color, photo_url, review, sort_order, visible, featured)
        values (${name}, ${rating ?? 5}, ${program || null}, ${location || null}, ${avatar_color || '#0d9488'}, ${photo_url || null}, ${review}, ${sort_order ?? 0}, ${visible ?? true}, ${featured ?? false})
        returning *`
      return res.status(201).json(row)
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      const { name, rating, program, location, avatar_color, photo_url, review, sort_order, visible, featured } = req.body || {}
      const [row] = await sql`
        update testimonials set
          name = coalesce(${name}, name),
          rating = coalesce(${rating}, rating),
          program = coalesce(${program}, program),
          location = coalesce(${location}, location),
          avatar_color = coalesce(${avatar_color}, avatar_color),
          photo_url = coalesce(${photo_url}, photo_url),
          review = coalesce(${review}, review),
          sort_order = coalesce(${sort_order}, sort_order),
          visible = coalesce(${visible}, visible),
          featured = coalesce(${featured}, featured)
        where id = ${id}
        returning *`
      return res.status(200).json(row)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      await sql`delete from testimonials where id = ${id}`
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('testimonials api error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
