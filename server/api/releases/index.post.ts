import { requireAuth } from '../../utils/session'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const { title, artists, year, format, label, style, country, cover, tracks } = body

  if (!title || !artists?.length || !format || !style?.length) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const release = await prisma.release.create({
    data: {
      title,
      artists,
      year: year ?? null,
      format,
      label: label ?? null,
      style,
      country: country ?? null,
      cover: cover ?? null,
      userId: user.id,
      tracks: {
        create:
          tracks?.map((track: { position: number; title: string }) => ({
            position: track.position,
            title: track.title,
          })) ?? [],
      },
    },
    include: { tracks: { orderBy: { position: 'asc' } } },
  })

  return release
})
