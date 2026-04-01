import { sendToAgent } from '../../plugins/agent'
import { requireAuth } from '../../utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  try {
    const response = await sendToAgent('get_config')
    return response.payload
  } catch (e: any) {
    throw createError({ statusCode: 503, message: e.message ?? 'Agent unavailable' })
  }
})
