import { getSessionUser } from '#server/utils/session'

export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
  }
})
