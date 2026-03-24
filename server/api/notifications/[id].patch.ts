export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Notification ID is required' })
  }

  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification) {
    throw createError({ statusCode: 404, message: 'Notification not found' })
  }

  if (notification.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { read: true },
  })

  return updated
})
