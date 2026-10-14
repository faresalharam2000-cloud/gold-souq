import sql from '@/lib/db'
import { getGoldsmithShopId } from '@/lib/goldsmith-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { updateProductAction } from '../../actions'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }) {
  const shopId = await getGoldsmithShopId()
  if (!shopId) redirect('/login')

  const { id } = await params
  const rows = await sql`SELECT * FROM products WHERE id = ${id} AND shop_id = ${shopId}`
  if (rows.length === 0) notFound()
  const p = rows[0]

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>← رجوع للوحة</Link>
      <h1 style={{ marginTop: '1rem' }}>✏️ تعديل المنتج</h1>

      <form action={updateProductAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <input type="hidden" name="id" value={p.id} />

        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>اسم المنتج *</span>
          <input name="title" required defaultValue={p.title} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>الوصف</span>
          <textarea name="description" rows={3} defaultValue={p.description || ''} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>رابط الصورة</span>
          <input name="image_url" type="url" defaultValue={p.image_url || ''} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>الوزن (جرام) *</span>
            <input name="weight" type="number" step="0.001" required defaultValue={p.weight} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>العيار *</span>
            <select name="karat" required defaultValue={p.karat} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
              {[24, 22, 21, 18, 14].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>نوع المصنعية *</span>
            <select name="making_charge_type" required defaultValue={p.making_charge_type} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
              <option value="per_gram">لكل جرام</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>قيمة المصنعية *</span>
            <input name="making_charge_value" type="number" step="0.01" required defaultValue={p.making_charge_value} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </label>
        </div>

        <button type="submit" style={{ padding: '0.9rem', background: '#c9a227', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
          حفظ التعديلات
        </button>
      </form>
    </main>
  )
}
