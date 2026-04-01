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
