import { Pool } from '@neondatabase/serverless';

let pool;
function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL غير مُعد في Vercel');
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sql: query, params } = req.body;
    if (!query) return res.status(400).json({ error: 'لا يوجد استعلام' });

    const p = getPool();
    const result = await p.query(query, params || []);

    return res.status(200).json({ data: result.rows });
  } catch (e) {
    console.error('DB error:', e);
    return res.status(500).json({ error: e.message || 'خطأ في قاعدة البيانات' });
  }
}
