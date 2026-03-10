import { H3Event, getCookie, setCookie, deleteCookie } from 'h3'
import { prisma } from './prisma'

const SESSION_COOKIE_NAME = 'beat-clerk-session'
const SESSION_EXPIRY_DAYS = 7

export async function createSession(event: H3Event, userId: string) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  const session = await prisma.session.create({
    data: { userId, expiresAt },
  })

  setCookie(event, SESSION_COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

export async function getSessionUser(event: H3Event) {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)
  if (!sessionId) return null

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    deleteCookie(event, SESSION_COOKIE_NAME)
    return null
  }

  return session.user
}

export async function requireAuth(event: H3Event) {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authorized' })
  return user
}

export async function deleteSession(event: H3Event) {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)
  if (sessionId) {
    await prisma.session
      .delete({
        where: { id: sessionId },
      })
      .catch(() => {})
  }
  deleteCookie(event, SESSION_COOKIE_NAME)
}
