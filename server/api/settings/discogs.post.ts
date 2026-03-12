export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { discogsUsername, discogsToken } = await readBody(event)

  if (!discogsUsername || !discogsToken) {
    throw createError({ statusCode: 400, message: 'Discogs username and password are required' })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { discogsUsername, discogsToken },
  })

  return { success: true }
})
