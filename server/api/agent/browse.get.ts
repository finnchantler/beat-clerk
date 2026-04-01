import { sendToAgent } from '#server/plugins/agent'
import { requireAuth } from '#server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const query = getQuery(event)
  const path = query.path as string | undefined

  try {
    const response = await sendToAgent('browse', path ? { path } : undefined)
    return response.payload
  } catch (e: any) {
    throw createError({ statusCode: 503, message: e.message ?? 'Agent unavailable' })
  }
})
