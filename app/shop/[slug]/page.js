import sql from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }) {
  const { slug } = await params
  const shops = await sql`SELECT * FROM shops WHERE slug = ${slug}`

  if (shops.length === 0) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>المحل غير موجود</h1>
        <a href="/">العودة للرئيسية</a>
      </main>
    )
  }

  const shop = shops[0]
  const products = await sql`
    SELECT * FROM products
    WHERE shop_id = ${shop.id} AND status = 'available'
    ORDER BY created_at DESC
  `

  const prices = await sql`SELECT * FROM gold_prices`
  const priceMap = Object.fromEntries(prices.map((p) => [p.karat, Number(p.price_per_gram)]))

  return (
    <main style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1>{shop.name}</h1>
      <p style={{ color: '#666' }}>{shop.city}</p>

      <h2 style={{ marginTop: '2rem' }}>المنتجات</h2>
      {products.length === 0 ? (
        <p>لا توجد منتجات حالياً.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {products.map((p) => {
            const goldPrice = priceMap[p.karat] || 0
            const base = goldPrice * Number(p.weight)
            const making =
              p.making_charge_type === 'per_gram'
                ? Number(p.making_charge_value) * Number(p.weight)
                : Number(p.making_charge_value)
            const total = base + making

            const msg = `مرحبًا، أرغب بطلب:%0A${p.title}%0Aالوزن: ${p.weight} جم%0Aالعيار: ${p.karat}%0Aالسعر: ${total.toFixed(2)} ريال`

            return (
              <div
                key={p.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '1rem',
                  background: '#fafafa',
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem' }}>{p.title}</h3>
                <p style={{ margin: '0.25rem 0', color: '#444' }}>
                  الوزن: {p.weight} جم
                </p>
                <p style={{ margin: '0.25rem 0', color: '#444' }}>
                  العيار: {p.karat}
                </p>
                <p
                  style={{
                    margin: '0.75rem 0',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#c9a227',
                  }}
                >
                  {total.toFixed(2)} ريال
                </p>
                <a
                  href={`https://wa.me/${shop.whatsapp}?text=${msg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#25D366',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  اطلب عبر واتساب
                </a>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
