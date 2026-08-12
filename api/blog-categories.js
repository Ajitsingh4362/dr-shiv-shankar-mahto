// /api/blog-categories
// GET            -> list categories (public)
// POST           -> create category (admin) body: { name, slug }
import { sql } from './_lib/db.js'
import { requireAuthOrRespond } from './_lib/auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await sql`select * from blog_categories order by name asc`
      return res.status(200).json(rows)
    }

    if (!(await requireAuthOrRespond(req, res))) return

    if (req.method === 'POST') {
      const { name, slug } = req.body || {}
      if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' })
      const [row] = await sql`insert into blog_categories (name, slug) values (${name}, ${slug}) returning *`
      return res.status(201).json(row)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      await sql`delete from blog_categories where id = ${id}`
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('blog-categories api error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
