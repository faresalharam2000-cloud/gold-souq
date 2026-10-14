'use server'
import { redirect } from 'next/navigation'
import sql from '@/lib/db'
import { hashPassword, setGoldsmithCookie, clearGoldsmithCookie } from '@/lib/goldsmith-auth'

export async function loginGoldsmithAction(formData) {
  const slug = formData.get('slug')?.trim()
  const password = formData.get('password')

  const rows = await sql`SELECT * FROM shops WHERE slug = ${slug} AND active = true`
  if (rows.length === 0) {
    redirect('/login?error=1')
  }

  const shop = rows[0]
  if (shop.password_hash !== hashPassword(password)) {
    redirect('/login?error=1')
  }

  await setGoldsmithCookie(shop.id)
  redirect('/dashboard')
}

export async function logoutGoldsmithAction() {
  await clearGoldsmithCookie()
  redirect('/login')
}
