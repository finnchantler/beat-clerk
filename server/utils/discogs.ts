import { Format, Style } from '../../app/generated/prisma/client'

const DISCOGS_API_BASE = 'https://api.discogs.com'

export async function fetchDiscogsCollection(username: string, token: string) {
  const releases: any[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const data: any = await $fetch(
      `${DISCOGS_API_BASE}/users/${username}/collection/folders/0/releases`,
      {
        headers: {
          Authorization: `Discogs token=${token}`,
          'User-Agent': 'beat-clerk/1.0',
        },
        query: {
          page,
          per_page: 100,
          sort: 'added',
          sort_order: 'desc',
        },
      }
    )

    releases.push(...data.releases)
    totalPages = data.pagination.pages
    page++
  }

  return releases
}

export function mapDiscogsRelease(item: any) {
  const info = item.basic_information

  return {
    title: info.title,
    artists: info.artists.map((a: any) => {
      const name = a.anv || a.name
      return name.replace(/\s*\(\d+\)\s*$/, '').trim()
    }),
    year: info.year || null,
    format: mapFormat(info.formats),
    label: info.labels?.[0]?.name ?? null,
    style: [] as Style[],
    country: null,
    cover: info.cover_image ?? null,
  }
}

function mapFormat(formats: any[]): Format {
  if (!formats?.length) return Format.VINYL
  const name = formats[0].name.toLowerCase()
  if (name.includes('vinyl')) return Format.VINYL
  if (name.includes('flac')) return Format.FLAC
  if (name.includes('mp3')) return Format.MP3
  if (name.includes('wav')) return Format.WAV
  if (name.includes('aiff')) return Format.AIFF
  return Format.VINYL
}
