import sql from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  updatePricesAction,
  addShopAction,
  toggleShopAction,
  deleteShopAction,
  resetPasswordAction,
  logoutAction,
} from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminPage({ searchParams }) {
  if (!(await isAdmin())) redirect('/admin/login')

  const params = await searchParams
  const prices = await sql`SELECT * FROM gold_prices ORDER BY karat DESC`
  const shops = await sql`SELECT * FROM shops ORDER BY created_at DESC`
  const priceMap = Object.fromEntries(prices.map((p) => [p.karat, p.price_per_gram]))

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>👑 لوحة المدير</h1>
        <form action={logoutAction}>
          <button style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            خروج
          </button>
        </form>
      </div>

      {params?.saved === '1' && (
        <div style={{ background: '#d4edda', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', color: '#155724' }}>
          ✅ تم الحفظ بنجاح
        </div>
      )}
      {params?.error === 'slug' && (
        <div style={{ background: '#fee', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', color: '#b00' }}>
          ❌ الرابط مستخدم من قبل.
        </div>
      )}
      {params?.error === 'password' && (
        <div style={{ background: '#fee', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', color: '#b00' }}>
          ❌ كلمة المرور مطلوبة (4 أحرف على الأقل).
        </div>
      )}

      <section style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px' }}>
        <h2>💰 أسعار الذهب اليوم (لكل جرام)</h2>
        <form action={updatePricesAction} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {[24, 22, 21, 18, 14].map((k) => (
            <div key={k}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>عيار {k}</label>
              <input type="number" step="0.01" name={`price_${k}`} defaultValue={priceMap[k] || ''} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button style={{ padding: '0.7rem 1.5rem', background: '#c9a227', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
              💾 حفظ الأسعار
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px' }}>
        <h2>➕ إضافة صائغ جديد</h2>
        <form action={addShopAction} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <input name="name" placeholder="اسم المحل" required style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="slug" placeholder="الرابط (إنجليزي: riyadh-gold)" required pattern="[a-z0-9-]+" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="city" placeholder="المدينة" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="whatsapp" placeholder="واتساب: 966501234567" required style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="password" placeholder="كلمة مرور الصائغ" required style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <div style={{ gridColumn: '1 / -1' }}>
            <button style={{ padding: '0.7rem 1.5rem', background: '#c9a227', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              إضافة
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px' }}>
        <h2>🏪 الصاغة ({shops.length})</h2>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>الاسم</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>الرابط</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>المدينة</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>واتساب</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>الحالة</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{shop.name}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <a href={`/shop/${shop.slug}`} target="_blank" style={{ color: '#c9a227' }}>/{shop.slug}</a>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{shop.city}</td>
                  <td style={{ padding: '0.75rem' }}>{shop.whatsapp}</td>
                  <td style={{ padding: '0.75rem' }}>{shop.active ? '✅ نشط' : '⛔ موقوف'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <form action={toggleShopAction}>
                        <input type="hidden" name="id" value={shop.id} />
                        <input type="hidden" name="active" value={shop.active.toString()} />
                        <button style={{ padding: '0.3rem 0.6rem', background: shop.active ? '#ffc107' : '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                          {shop.active ? 'إيقاف' : 'تفعيل'}
                        </button>
                      </form>
                      <form action={deleteShopAction}>
                        <input type="hidden" name="id" value={shop.id} />
                        <button style={{ padding: '0.3rem 0.6rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                          حذف
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
