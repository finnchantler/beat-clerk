import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany()
  return users
})
