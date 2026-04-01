import { sendToAgent } from '../../plugins/agent'
import { requireAuth } from '../../utils/session'
import { matchFiles } from '../../utils/matcher'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const path = query.path as string | undefined

  try {
    const browseResponse = await sendToAgent('browse', path ? { path } : undefined)
    const files = browseResponse.payload.files

    if (!files.length) {
      return { matches: [], dirs: browseResponse.payload.dirs }
    }

    const matches = await matchFiles(files, user.id)

    return {
      matches,
      dirs: browseResponse.payload.dirs,
      currentPath: browseResponse.payload.currentPath,
      rootDir: browseResponse.payload.rootDir,
    }
  } catch (e: any) {
    throw createError({ statusCode: 503, message: e.message ?? 'Agent unavailable' })
  }
})
