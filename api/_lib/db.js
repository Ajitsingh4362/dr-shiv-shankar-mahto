// Shared Neon Postgres connection helper for Vercel serverless functions.
// Uses the Neon serverless driver (works over HTTP/WebSocket, no TCP pool needed).
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it in Vercel Project Settings -> Environment Variables.')
}

// `sql` is a tagged-template function: sql`select * from gallery where id = ${id}`
export const sql = neon(process.env.DATABASE_URL)
