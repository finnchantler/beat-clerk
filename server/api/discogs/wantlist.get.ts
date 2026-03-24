export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!fullUser?.discogsUsername || !fullUser?.discogsToken) {
    throw createError({ statusCode: 400, message: 'Discogs credentials not configured.' })
  }

  const wants = await fetchDiscogsWantlist(fullUser.discogsUsername, fullUser.discogsToken)

  const watchlistItems = await prisma.watchlistItem.findMany({
    where: { userId: user.id },
  })

  const watchedIds = new Set(watchlistItems.map((w) => w.discogsReleaseId))

  return wants
    .sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime())
    .map((item) => ({
      ...mapDiscogsWantlistItem(item),
      watched: watchedIds.has(item.basic_information.id),
    }))
})
