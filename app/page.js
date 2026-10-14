import sql from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let shops = []
  let error = null

  try {
    shops = await sql`SELECT * FROM shops WHERE active = true ORDER BY created_at DESC`
  } catch (e) {
    error = e.message
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🏆 منصة الذهب</h1>
      <p style={{ color: '#666' }}>منصة عرض أسعار الذهب للصاغة</p>

      {error && (
        <div style={{ background: '#fee', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
          <strong>خطأ في الاتصال بقاعدة البيانات:</strong>
          <p>{error}</p>
        </div>
      )}

      <h2 style={{ marginTop: '2rem' }}>الصاغة المسجلون</h2>
      {shops.length === 0 ? (
        <p>لا يوجد صاغة مسجلون بعد.</p>
      ) : (
        <ul style={{ lineHeight: '2' }}>
          {shops.map((shop) => (
            <li key={shop.id}>
              <a href={`/shop/${shop.slug}`} style={{ color: '#c9a227', fontWeight: 'bold' }}>
                {shop.name}
              </a>
              {' — '}
              <span style={{ color: '#666' }}>{shop.city}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
