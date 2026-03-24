export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { discogsReleaseId, title, artist, cover } = await readBody(event)

  if (!discogsReleaseId || !title || !artist) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const existing = await prisma.watchlistItem.findUnique({
    where: {
      userId_discogsReleaseId: {
        userId: user.id,
        discogsReleaseId,
      },
    },
  })

  if (existing) {
    throw createError({ statusCode: 409, message: 'Already on watchlist' })
  }

  const item = await prisma.watchlistItem.create({
    data: {
      userId: user.id,
      discogsReleaseId,
      title,
      artist,
      cover: cover ?? null,
    },
  })

  return item
})
