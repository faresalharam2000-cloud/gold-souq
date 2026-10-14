import { loginGoldsmithAction } from './actions'
import { getGoldsmithShopId } from '@/lib/goldsmith-auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }) {
  if (await getGoldsmithShopId()) redirect('/dashboard')
  const params = await searchParams

  return (
    <main style={{ maxWidth: '400px', margin: '6rem auto', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🔐 دخول الصائغ</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>أدخل بياناتك للوصول إلى لوحتك</p>

      {params?.error === '1' && (
        <div style={{ background: '#fee', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', color: '#b00' }}>
          رابط أو كلمة مرور غير صحيحة
        </div>
      )}

      <form action={loginGoldsmithAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          name="slug"
          placeholder="رابط متجرك (مثل: riyadh-gold)"
          required
          autoFocus
          style={{ padding: '0.85rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          required
          style={{ padding: '0.85rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: '0.85rem', background: '#c9a227', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          دخول
        </button>
      </form>
    </main>
  )
}
