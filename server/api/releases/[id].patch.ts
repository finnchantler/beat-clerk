import { requireAuth } from '../../utils/session'
import { prisma } from '../../utils/prisma'
import { Format, Style } from '~/generated/prisma/enums'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Release ID is required' })
  }

  const release = await prisma.release.findUnique({ where: { id } })

  if (!release) {
    throw createError({ statusCode: 404, message: 'Release not found' })
  }

  if (release.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event)

  const allowedFields: Record<string, (v: any) => boolean> = {
    title: (v) => typeof v === 'string',
    artists: (v) => Array.isArray(v) && v.every((a) => typeof a === 'string'),
    year: (v) => v === null || (typeof v === 'number' && v >= 1900 && v <= 2099),
    format: (v) => Object.values(Format).includes(v),
    label: (v) => v === null || typeof v === 'string',
    style: (v) => Array.isArray(v) && v.every((s) => Object.values(Style).includes(s)),
    country: (v) => v === null || typeof v === 'string',
  }

  const data: Record<string, any> = {}
  for (const [key, validate] of Object.entries(allowedFields)) {
    if (key in body) {
      if (!validate(body[key])) {
        throw createError({ statusCode: 400, message: `Invalid value for field: ${key}` })
      }
      data[key] = body[key]
    }
  }

  if (Object.keys(data).length === 0) {
    throw createError({ statusCode: 400, message: 'No valid fields to update' })
  }

  return prisma.release.update({
    where: { id },
    data,
    include: { tracks: { orderBy: { position: 'asc' } } },
  })
})
