import { requireAuth } from '../../utils/session'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const releases = await prisma.release.findMany({
    where: { userId: user.id },
    include: { tracks: { orderBy: { position: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })

  return releases
})
