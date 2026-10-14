'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import sql from '@/lib/db'
import { getGoldsmithShopId, clearGoldsmithCookie } from '@/lib/goldsmith-auth'

async function requireShop() {
  const shopId = await getGoldsmithShopId()
  if (!shopId) redirect('/login')
  return shopId
}

export async function createProductAction(formData) {
  const shopId = await requireShop()

  const title = formData.get('title')
  const description = formData.get('description') || ''
  const weight = Number(formData.get('weight'))
  const karat = Number(formData.get('karat'))
  const making_charge_type = formData.get('making_charge_type')
  const making_charge_value = Number(formData.get('making_charge_value') || 0)
  const image_url = formData.get('image_url') || ''

  await sql`
    INSERT INTO products (shop_id, title, description, weight, karat, making_charge_type, making_charge_value, image_url)
    VALUES (${shopId}, ${title}, ${description}, ${weight}, ${karat}, ${making_charge_type}, ${making_charge_value}, ${image_url})
  `

  revalidatePath('/dashboard')
  redirect('/dashboard?saved=1')
}

export async function updateProductAction(formData) {
  const shopId = await requireShop()
  const id = formData.get('id')

  const title = formData.get('title')
  const description = formData.get('description') || ''
  const weight = Number(formData.get('weight'))
  const karat = Number(formData.get('karat'))
  const making_charge_type = formData.get('making_charge_type')
  const making_charge_value = Number(formData.get('making_charge_value') || 0)
  const image_url = formData.get('image_url') || ''

  await sql`
    UPDATE products
    SET title = ${title}, description = ${description}, weight = ${weight}, karat = ${karat},
        making_charge_type = ${making_charge_type}, making_charge_value = ${making_charge_value},
        image_url = ${image_url}
    WHERE id = ${id} AND shop_id = ${shopId}
  `

  revalidatePath('/dashboard')
  redirect('/dashboard?saved=1')
}

export async function deleteProductAction(formData) {
  const shopId = await requireShop()
  const id = formData.get('id')

  await sql`DELETE FROM products WHERE id = ${id} AND shop_id = ${shopId}`
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function toggleProductStatusAction(formData) {
  const shopId = await requireShop()
  const id = formData.get('id')
  const status = formData.get('status')

  const newStatus = status === 'available' ? 'hidden' : 'available'
  await sql`UPDATE products SET status = ${newStatus} WHERE id = ${id} AND shop_id = ${shopId}`

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function logoutAction() {
  await clearGoldsmithCookie()
  redirect('/login')
}
