import { requireAuth } from '../../utils/session'
import { prisma } from '../../utils/prisma'
import { fetchDiscogsCollection, mapDiscogsRelease } from '../../utils/discogs'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!fullUser?.discogsUsername || !fullUser?.discogsToken) {
    throw createError({
      statusCode: 400,
      message: 'Discogs credentials not configured. Add them in settings first.',
    })
  }

  const discogsReleases = await fetchDiscogsCollection(
    fullUser.discogsUsername,
    fullUser.discogsToken
  )

  const mapped = discogsReleases.map(mapDiscogsRelease)

  const created = await prisma.$transaction(
    mapped.map((release) =>
      prisma.release.create({
        data: {
          ...release,
          userId: user.id,
        },
      })
    )
  )

  return {
    imported: created.length,
  }
})
