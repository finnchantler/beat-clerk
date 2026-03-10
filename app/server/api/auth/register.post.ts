import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcrypt'
import { createSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const { email, username, password } = await readBody(event)

  if (!email || !username || !password) {
    throw createError({ statusCode: 400, message: 'All fields are required ' })
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  })

  if (existing) {
    throw createError({ statusCode: 409, message: 'User already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { email, username, passwordHash },
  })

  await createSession(event, user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  }
})
