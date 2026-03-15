import { requireAuth } from '#server/utils/session'
import { prisma } from '#server/utils/prisma'
import {
  fetchDiscogsCollection,
  fetchDiscogsReleaseDetails,
  mapDiscogsRelease,
} from '#server/utils/discogs'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const fullUser = await prisma.user.findUnique({ where: { id: user.id } })

  if (!fullUser?.discogsUsername || !fullUser?.discogsToken) {
    await sendError(
      event,
      createError({ statusCode: 400, message: 'Discogs credentials not configured' })
    )
    return
  }

  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const send = (data: object) => {
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  try {
    const discogsReleases = await fetchDiscogsCollection(
      fullUser.discogsUsername,
      fullUser.discogsToken
    )

    const total = discogsReleases.length
    let imported = 0

    for (const item of discogsReleases) {
      const mapped = mapDiscogsRelease(item)
      const discogsId = item.basic_information.id

      const tracks = await fetchDiscogsReleaseDetails(discogsId, fullUser.discogsToken)

      await sleep(1100)

      await prisma.release.create({
        data: {
          ...mapped,
          discogsId,
          userId: user.id,
          tracks: { create: tracks },
        },
      })

      imported++

      send({
        type: 'progress',
        imported,
        total,
        title: mapped.title,
      })
    }

    send({ type: 'complete', imported, total })
  } catch (e: any) {
    send({ type: 'error', message: e?.message ?? 'Sync failed' })
  } finally {
    event.node.res.end()
  }
})
