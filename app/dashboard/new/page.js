import { getGoldsmithShopId } from '@/lib/goldsmith-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createProductAction } from '../actions'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  if (!(await getGoldsmithShopId())) redirect('/login')

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>← رجوع للوحة</Link>
      <h1 style={{ marginTop: '1rem' }}>➕ إضافة منتج</h1>

      <form action={createProductAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>اسم المنتج *</span>
          <input name="title" required style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>الوصف</span>
          <textarea name="description" rows={3} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>رابط الصورة (اختياري)</span>
          <input name="image_url" type="url" placeholder="https://..." style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>الوزن (جرام) *</span>
            <input name="weight" type="number" step="0.001" required style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>العيار *</span>
            <select name="karat" required defaultValue="21" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
              <option value="24">24</option>
              <option value="22">22</option>
              <option value="21">21</option>
              <option value="18">18</option>
              <option value="14">14</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>نوع المصنعية *</span>
            <select name="making_charge_type" required defaultValue="per_gram" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
              <option value="per_gram">لكل جرام</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' }}>قيمة المصنعية *</span>
            <input name="making_charge_value" type="number" step="0.01" required defaultValue="0" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </label>
        </div>

        <button type="submit" style={{ padding: '0.9rem', background: '#c9a227', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
          حفظ المنتج
        </button>
      </form>
    </main>
  )
}
