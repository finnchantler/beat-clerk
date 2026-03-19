import { requireAuth } from '#server/utils/session'
import { prisma } from '#server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Track ID is required' })
  }

  const body = await readBody(event)
  const { starred, ignored } = body

  const track = await prisma.track.findUnique({
    where: { id },
    include: { release: true },
  })

  if (!track) {
    throw createError({ statusCode: 404, message: 'Track not found' })
  }

  if (track.release.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const updated = await prisma.track.update({
    where: { id },
    data: {
      ...(typeof starred === 'boolean' && { starred }),
      ...(typeof ignored === 'boolean' && { ignored }),
    },
  })

  return updated
})
