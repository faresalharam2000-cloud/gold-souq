import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'goldsmith_session'

function sign(value) {
  const secret = process.env.ADMIN_SECRET || 'fallback'
  return crypto.createHmac('sha256', secret).update(value).digest('hex')
}

export function hashPassword(password) {
  const salt = process.env.ADMIN_SECRET || 'salt'
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

export async function getGoldsmithShopId() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  const [shopId, sig] = token.split('.')
  if (!shopId || !sig) return null
  if (sign(shopId) !== sig) return null
  return shopId
}

export async function setGoldsmithCookie(shopId) {
  const cookieStore = await cookies()
  const token = `${shopId}.${sign(shopId)}`
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
}

export async function clearGoldsmithCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
