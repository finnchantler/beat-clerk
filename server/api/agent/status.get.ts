import { isAgentConnected } from '#server/plugins/agent'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  return { connected: isAgentConnected() }
})
