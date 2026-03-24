export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Watchlist item ID is required' })
  }

  const item = await prisma.watchlistItem.findUnique({
    where: { id },
  })

  if (!item) {
    throw createError({ statusCode: 404, message: 'Watchlist item not found' })
  }

  if (item.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  await prisma.watchlistItem.delete({ where: { id } })

  return { success: true }
})
