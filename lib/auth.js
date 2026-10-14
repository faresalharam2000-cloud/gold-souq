import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'admin_session'

function sign(value) {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'fallback'
  return crypto.createHmac('sha256', secret).update(value).digest('hex')
}

export async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  const [value, sig] = token.split('.')
  if (!value || !sig) return false
  return sign(value) === sig
}

export async function setAdminCookie() {
  const cookieStore = await cookies()
  const value = 'admin'
  const token = `${value}.${sign(value)}`
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
