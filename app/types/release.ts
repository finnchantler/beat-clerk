export enum Style {
  TECHNO = 'TECHNO',
  ELECTRO = 'ELECTRO',
  AMBIENT = 'AMBIENT',
  DOWNTEMPO = 'DOWNTEMPO',
  MINIMAL = 'MINIMAL',
  BREAKBEAT = 'BREAKBEAT',
  PROGRESSIVE_TRANCE = 'PROGRESSIVE_TRANCE',
  TRANCE = 'TRANCE',
  ACID = 'ACID',
  HOUSE = 'HOUSE',
  TECH_HOUSE = 'TECH_HOUSE',
  PROGRESSIVE_HOUSE = 'PROGRESSIVE_HOUSE',
  IDM = 'IDM',
  TRIBAL = 'TRIBAL',
  LEFTFIELD = 'LEFTFIELD',
}

export enum Format {
  VINYL = 'VINYL',
  MP3 = 'MP3',
  FLAC = 'FLAC',
  WAV = 'WAV',
  AIFF = 'AIFF',
}

export interface Track {
  id: string
  position: number
  title: string
  releaseId: string
}

export interface Release {
  id: string
  title: string
  artists: string[]
  year: number | null
  format: Format
  label: string | null
  style: Style[]
  country: string | null
  cover: string | null
  tracks: Track[]
  userId: string
  createdAt: string
  updatedAt: string
}

export type CreateReleaseInput = {
  title: string
  artists: string[]
  year?: number
  format: Format
  label?: string
  style: Style[]
  country?: string
  cover?: string
  tracks: { position: number; title: string }[]
}
