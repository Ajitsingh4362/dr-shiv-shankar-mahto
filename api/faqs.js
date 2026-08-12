// /api/faqs
// GET            -> list visible faqs (public)
// GET ?all=1     -> list all faqs incl. hidden (admin)
// POST           -> create faq (admin)
// PUT  ?id=...   -> update faq (admin)
// DELETE ?id=... -> delete faq (admin)
import { sql } from './_lib/db.js'
import { requireAuthOrRespond } from './_lib/auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const showAll = req.query.all === '1'
      const rows = showAll
        ? await sql`select * from faqs order by sort_order asc, created_at asc`
        : await sql`select * from faqs where visible = true order by sort_order asc, created_at asc`
      return res.status(200).json(rows)
    }

    if (!(await requireAuthOrRespond(req, res))) return

    if (req.method === 'POST') {
      const { category, question, answer, sort_order, visible } = req.body || {}
      if (!question || !answer) return res.status(400).json({ error: 'question and answer are required' })
      const [row] = await sql`
        insert into faqs (category, question, answer, sort_order, visible)
        values (${category || 'General'}, ${question}, ${answer}, ${sort_order ?? 0}, ${visible ?? true})
        returning *`
      return res.status(201).json(row)
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      const { category, question, answer, sort_order, visible } = req.body || {}
      const [row] = await sql`
        update faqs set
          category = coalesce(${category}, category),
          question = coalesce(${question}, question),
          answer = coalesce(${answer}, answer),
          sort_order = coalesce(${sort_order}, sort_order),
          visible = coalesce(${visible}, visible)
        where id = ${id}
        returning *`
      return res.status(200).json(row)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      await sql`delete from faqs where id = ${id}`
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('faqs api error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
