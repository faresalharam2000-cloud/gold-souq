import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { sql: query, params } = req.body;

    if (!query) return res.status(400).json({ error: 'No query' });

    const result = await sql(query, params || []);
    return res.status(200).json({ data: result });
  } catch (e) {
    console.error('DB error:', e);
    return res.status(500).json({ error: e.message });
  }
}
