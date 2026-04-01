import { prisma } from './prisma'

interface FileMetadata {
  title: string | null
  artist: string | null
  album: string | null
  trackNumber: number | null
}

interface AudioFile {
  path: string
  name: string
  format: string
  metadata: FileMetadata
}

export interface MatchResult {
  filePath: string
  fileName: string
  confidence: number
  matchedOn: 'metadata' | 'filename' | null
  proposed: {
    trackId: string
    trackTitle: string
    releaseTitle: string
    artists: string[]
  } | null
}

function normalise(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function similarity(a: string, b: string): number {
  const na = normalise(a)
  const nb = normalise(b)

  if (na === nb) return 100
  if (na.includes(nb) || nb.includes(na)) return 85

  const aWords = new Set(na.split(' '))
  const bWords = new Set(nb.split(' '))
  const intersection = [...aWords].filter((w) => bWords.has(w))
  const union = new Set([...aWords, ...bWords])

  return Math.round((intersection.length / union.size) * 100)
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, '')
}

function stripTrackNumber(str: string): string {
  return str.replace(/^\d+[\s.\-_]+/, '').trim()
}

export async function matchFiles(files: AudioFile[], userId: string): Promise<MatchResult[]> {
  const releases = await prisma.release.findMany({
    where: { userId },
    include: { tracks: true },
  })

  return files.map((file) => {
    let bestScore = 0
    let bestTrackId: string | null = null
    let bestTrackTitle: string | null = null
    let bestReleaseTitle: string | null = null
    let bestArtists: string[] = []
    let matchedOn: 'metadata' | 'filename' | null = null

    for (const release of releases) {
      for (const track of release.tracks) {
        let score = 0
        let method: 'metadata' | 'filename' = 'metadata'

        if (file.metadata.title) {
          const titleScore = similarity(file.metadata.title, track.title)

          const artistMatch = file.metadata.artist
            ? release.artists.some((a) => similarity(file.metadata.artist!, a) > 70)
            : false

          const albumMatch = file.metadata.album
            ? similarity(file.metadata.album, release.title) > 70
            : false

          score = titleScore
          if (artistMatch) score = Math.min(100, score + 10)
          if (albumMatch) score = Math.min(100, score + 5)

          const trackNumberMatch =
            file.metadata.trackNumber !== null && file.metadata.trackNumber === track.position

          if (trackNumberMatch) score = Math.min(100, score + 5)
        } else {
          method = 'filename'
          const stripped = stripTrackNumber(stripExtension(file.name))
          score = similarity(stripped, track.title)
        }

        if (score > bestScore) {
          bestScore = score
          bestTrackId = track.id
          bestTrackTitle = track.title
          bestReleaseTitle = release.title
          bestArtists = release.artists
          matchedOn = method
        }
      }
    }

    const CONFIDENCE_THRESHOLD = 60

    return {
      filePath: file.path,
      fileName: file.name,
      confidence: bestScore,
      matchedOn: bestScore >= CONFIDENCE_THRESHOLD ? matchedOn : null,
      proposed:
        bestScore >= CONFIDENCE_THRESHOLD && bestTrackId
          ? {
              trackId: bestTrackId,
              trackTitle: bestTrackTitle!,
              releaseTitle: bestReleaseTitle!,
              artists: bestArtists,
            }
          : null,
    }
  })
}
