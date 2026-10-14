'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import sql from '@/lib/db'
import { setAdminCookie, clearAdminCookie, isAdmin } from '@/lib/auth'
import { hashPassword } from '@/lib/goldsmith-auth'

export async function loginAction(formData) {
  const password = formData.get('password')
  if (password !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login?error=1')
  }
  await setAdminCookie()
  redirect('/admin')
}

export async function logoutAction() {
  await clearAdminCookie()
  redirect('/admin/login')
}

export async function updatePricesAction(formData) {
  if (!(await isAdmin())) redirect('/admin/login')

  const karats = [24, 22, 21, 18, 14]
  for (const k of karats) {
    const price = formData.get(`price_${k}`)
    if (price && price !== '') {
      await sql`
        INSERT INTO gold_prices (karat, price_per_gram, updated_at)
        VALUES (${k}, ${Number(price)}, now())
        ON CONFLICT (karat) DO UPDATE
        SET price_per_gram = ${Number(price)}, updated_at = now()
      `
    }
  }
  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin?saved=1')
}

export async function addShopAction(formData) {
  if (!(await isAdmin())) redirect('/admin/login')

  const name = formData.get('name')
  const slug = formData.get('slug')
  const city = formData.get('city')
  const whatsapp = formData.get('whatsapp')
  const password = formData.get('password')

  if (!password || password.length < 4) {
    redirect('/admin?error=password')
  }

  const passwordHash = hashPassword(password)

  try {
    await sql`
      INSERT INTO shops (name, slug, city, whatsapp, password_hash)
      VALUES (${name}, ${slug}, ${city}, ${whatsapp}, ${passwordHash})
    `
  } catch (e) {
    redirect('/admin?error=slug')
  }
  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin?saved=1')
}

export async function resetPasswordAction(formData) {
  if (!(await isAdmin())) redirect('/admin/login')

  const id = formData.get('id')
  const password = formData.get('password')
  if (!password || password.length < 4) redirect('/admin')

  await sql`UPDATE shops SET password_hash = ${hashPassword(password)} WHERE id = ${id}`
  revalidatePath('/admin')
  redirect('/admin?saved=1')
}

export async function toggleShopAction(formData) {
  if (!(await isAdmin())) redirect('/admin/login')

  const id = formData.get('id')
  const active = formData.get('active') === 'true'
  await sql`UPDATE shops SET active = ${!active} WHERE id = ${id}`
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteShopAction(formData) {
  if (!(await isAdmin())) redirect('/admin/login')

  const id = formData.get('id')
  await sql`DELETE FROM shops WHERE id = ${id}`
  revalidatePath('/admin')
  redirect('/admin')
}
