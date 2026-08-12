// /api/blog-posts
// GET                  -> list published posts (public), most recent first
// GET ?all=1           -> list all posts incl. drafts (admin dashboard)
// GET ?slug=...         -> single published post by slug (public)
// GET ?id=...&all=1     -> single post by id, any status (admin editor)
// POST                 -> create post (admin)
// PUT  ?id=...          -> update post (admin)
// DELETE ?id=...        -> delete post (admin)
import { sql } from './_lib/db.js'
import { requireAuthOrRespond } from './_lib/auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { slug, id, all } = req.query

      if (slug) {
        const [row] = await sql`select * from blog_posts where slug = ${slug} and published = true limit 1`
        return res.status(200).json(row || null)
      }
      if (id) {
        const [row] = await sql`select * from blog_posts where id = ${id} limit 1`
        return res.status(200).json(row || null)
      }
      const rows = all === '1'
        ? await sql`select id, title, slug, excerpt, cover_image, category, published, published_at, created_at from blog_posts order by created_at desc`
        : await sql`select id, title, slug, excerpt, cover_image, category, published_at from blog_posts where published = true order by published_at desc`
      return res.status(200).json(rows)
    }

    if (!(await requireAuthOrRespond(req, res))) return

    if (req.method === 'POST') {
      const { title, slug, excerpt, content, cover_image, category, published } = req.body || {}
      if (!title || !slug) return res.status(400).json({ error: 'title and slug are required' })
      const [row] = await sql`
        insert into blog_posts (title, slug, excerpt, content, cover_image, category, published, published_at)
        values (${title}, ${slug}, ${excerpt || null}, ${content || null}, ${cover_image || null}, ${category || null}, ${published ?? false}, ${published ? sql`now()` : null})
        returning *`
      return res.status(201).json(row)
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      const { title, slug, excerpt, content, cover_image, category, published } = req.body || {}
      const [existing] = await sql`select published, published_at from blog_posts where id = ${id}`
      const newlyPublished = published && existing && !existing.published
      const [row] = await sql`
        update blog_posts set
          title = coalesce(${title}, title),
          slug = coalesce(${slug}, slug),
          excerpt = coalesce(${excerpt}, excerpt),
          content = coalesce(${content}, content),
          cover_image = coalesce(${cover_image}, cover_image),
          category = coalesce(${category}, category),
          published = coalesce(${published}, published),
          published_at = case when ${newlyPublished} then now() else published_at end,
          updated_at = now()
        where id = ${id}
        returning *`
      return res.status(200).json(row)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id query param is required' })
      await sql`delete from blog_posts where id = ${id}`
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('blog-posts api error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
