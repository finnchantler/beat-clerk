export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const items = await prisma.watchlistItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return items
})
