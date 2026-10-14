import sql from '@/lib/db'
import { getGoldsmithShopId } from '@/lib/goldsmith-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteProductAction, toggleProductStatusAction, logoutAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }) {
  const shopId = await getGoldsmithShopId()
  if (!shopId) redirect('/login')

  const params = await searchParams
  const shops = await sql`SELECT * FROM shops WHERE id = ${shopId}`
  if (shops.length === 0) redirect('/login')
  const shop = shops[0]

  const products = await sql`
    SELECT * FROM products WHERE shop_id = ${shopId} ORDER BY created_at DESC
  `

  const prices = await sql`SELECT * FROM gold_prices`
  const priceMap = Object.fromEntries(prices.map((p) => [p.karat, Number(p.price_per_gram)]))

  return (
    <main style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>🏪 {shop.name}</h1>
          <p style={{ color: '#666', margin: '0.25rem 0' }}>
            رابط متجرك:{' '}
            <a href={`/shop/${shop.slug}`} target="_blank" style={{ color: '#c9a227', fontWeight: 'bold' }}>
              /shop/{shop.slug}
            </a>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            href="/dashboard/new"
            style={{ padding: '0.6rem 1.2rem', background: '#c9a227', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            ➕ إضافة منتج
          </Link>
          <form action={logoutAction}>
            <button style={{ padding: '0.6rem 1.2rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              خروج
            </button>
          </form>
        </div>
      </div>

      {params?.saved === '1' && (
        <div style={{ background: '#d4edda', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', color: '#155724' }}>
          ✅ تم الحفظ بنجاح
        </div>
      )}

      <h2 style={{ marginTop: '2rem' }}>منتجاتك ({products.length})</h2>

      {products.length === 0 ? (
        <p style={{ color: '#666' }}>لا توجد منتجات بعد. ابدأ بإضافة منتج جديد.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {products.map((p) => {
            const goldPrice = priceMap[p.karat] || 0
            const base = goldPrice * Number(p.weight)
            const making = p.making_charge_type === 'per_gram'
              ? Number(p.making_charge_value) * Number(p.weight)
              : Number(p.making_charge_value)
            const total = base + making

            return (
              <div key={p.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: p.status === 'hidden' ? '#f9f9f9' : 'white', opacity: p.status === 'hidden' ? 0.6 : 1 }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 0.25rem' }}>{p.title} {p.status === 'hidden' && <span style={{ color: '#999', fontSize: '0.85rem' }}>(مخفي)</span>}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                    {p.weight} جم — عيار {p.karat} — مصنعية {p.making_charge_value} {p.making_charge_type === 'per_gram' ? 'ريال/جم' : 'ريال'}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#c9a227', fontWeight: 'bold' }}>
                    {total.toFixed(2)} ريال
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link
                    href={`/dashboard/edit/${p.id}`}
                    style={{ padding: '0.4rem 0.9rem', background: '#0d6efd', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem' }}
                  >
                    تعديل
                  </Link>
                  <form action={toggleProductStatusAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="status" value={p.status} />
                    <button style={{ padding: '0.4rem 0.9rem', background: p.status === 'available' ? '#ffc107' : '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      {p.status === 'available' ? 'إخفاء' : 'إظهار'}
                    </button>
                  </form>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button style={{ padding: '0.4rem 0.9rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      حذف
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
