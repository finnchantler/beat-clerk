import { sendToAgent } from '../../plugins/agent'
import { requireAuth } from '../../utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)

  try {
    const response = await sendToAgent('set_config', body)
    return response.payload
  } catch (e: any) {
    throw createError({ statusCode: 503, message: e.message ?? 'Agent unavailable' })
  }
})
