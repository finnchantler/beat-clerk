import bcrypt from 'bcrypt'
import { createSession } from '#server/utils/session'
import { prisma } from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'All fields are required' })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  await createSession(event, user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  }
})
