import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'DATABASE_URL غير مُعد في Vercel' });
    }

    const sql = neon(process.env.DATABASE_URL);
    const { sql: query, params } = req.body;

    if (!query) return res.status(400).json({ error: 'لا يوجد استعلام' });

    // استخدام sql.query للاستعلامات الديناميكية
    const result = await sql.query(query, params || []);
    return res.status(200).json({ data: result });
  } catch (e) {
    console.error('DB error:', e);
    return res.status(500).json({ error: e.message || 'خطأ في قاعدة البيانات' });
  }
}
