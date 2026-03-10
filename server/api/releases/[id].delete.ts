import { requireAuth } from '../../utils/session'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Release ID is required' })
  }

  const release = await prisma.release.findUnique({
    where: { id },
  })

  if (!release) {
    throw createError({ statusCode: 404, message: 'Release not found' })
  }

  if (release.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  await prisma.release.delete({ where: { id } })

  return { success: true }
})
