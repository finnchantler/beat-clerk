import { requireAuth } from '../../utils/session'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { trackId, filePath } = await readBody(event)

  if (!trackId || !filePath) {
    throw createError({ statusCode: 400, message: 'trackId and filePath are required' })
  }

  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: { release: true },
  })

  if (!track) {
    throw createError({ statusCode: 404, message: 'Track not found' })
  }

  if (track.release.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const updated = await prisma.track.update({
    where: { id: trackId },
    data: { filePath },
  })

  return updated
})
