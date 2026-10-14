import { loginAction } from '../actions'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }) {
  if (await isAdmin()) redirect('/admin')
  const params = await searchParams

  return (
    <main style={{ maxWidth: '400px', margin: '6rem auto', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🔐 دخول المدير</h1>

      {params?.error === '1' && (
        <div style={{ background: '#fee', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', color: '#b00' }}>
          كلمة المرور غير صحيحة
        </div>
      )}

      <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          required
          autoFocus
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
