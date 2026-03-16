const STORAGE_KEY = 'accent-colour'
const DEFAULT_COLOUR = '#451d47'

export const ACCENT_COLOURS = [
  { value: '#451d47', label: 'Purple' },
  { value: '#4E1511', label: 'Red' },
  { value: '#262A65', label: 'Blue' },
  { value: '#113B29', label: 'Green' },
] as const

export type AccentColour = (typeof ACCENT_COLOURS)[number]['value']

const accentColour = ref<AccentColour>(DEFAULT_COLOUR)

const apply = (colour: AccentColour) => {
  document.documentElement.style.setProperty('--colour-background-gradient', colour)
}

export const useAccentColour = () => {
  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY) as AccentColour | null
    const colour = stored ?? DEFAULT_COLOUR
    accentColour.value = colour
    apply(colour)
  }

  const setColour = (colour: AccentColour) => {
    accentColour.value = colour
    localStorage.setItem(STORAGE_KEY, colour)
    apply(colour)
  }

  return { accentColour, init, setColour }
}
