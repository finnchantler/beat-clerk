<script setup lang="ts">
import { Style, Format } from '~/types/release'
import type { CreateReleaseInput } from '~/types/release'

const { addRelease } = useReleases()

const emit = defineEmits<{
  added: []
}>()

const title = ref('')
const artists = ref<string[]>([''])
const year = ref<number | undefined>(undefined)
const format = ref<Format>(Format.VINYL)
const label = ref('')
const style = ref<Style[]>([])
const country = ref('')
const tracks = ref<{ position: number; title: string }[]>([{ position: 1, title: '' }])

const loading = ref(false)
const error = ref<string | null>(null)

const addArtist = () => {
  artists.value.push('')
}

const removeArtist = (index: number) => {
  if (artists.value.length > 1) {
    artists.value.splice(index, 1)
  }
}

const addTrack = () => {
  tracks.value.push({ position: tracks.value.length + 1, title: '' })
}

const removeTrack = (index: number) => {
  tracks.value.splice(index, 1)
  tracks.value.forEach((track, i) => {
    track.position = i + 1
  })
}

const handleSubmit = async () => {
  error.value = null

  if (!title.value || !artists.value[0] || !format.value || !style.value.length) {
    error.value = 'Title, at least one artist, format and style are required'
    return
  }

  const input: CreateReleaseInput = {
    title: title.value,
    artists: artists.value.filter((a) => a.trim() !== ''),
    format: format.value,
    style: style.value,
    year: year.value,
    label: label.value || undefined,
    country: country.value || undefined,
    tracks: tracks.value.filter((t) => t.title.trim() !== ''),
  }

  loading.value = true
  try {
    await addRelease(input)
    resetForm()
    emit('added')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Something went wrong'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  title.value = ''
  artists.value = ['']
  year.value = undefined
  format.value = Format.VINYL
  label.value = ''
  style.value = []
  country.value = ''
  tracks.value = [{ position: 1, title: '' }]
}

const styleOptions = Object.values(Style).map((s) => ({
  value: s,
  label: s.replace(/_/g, ' '),
}))

const formatOptions = Object.values(Format)
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Title *</label>
      <input v-model="title" type="text" placeholder="Release title" />
    </div>

    <div>
      <label>Artists *</label>
      <div v-for="(artist, index) in artists" :key="index">
        <input v-model="artists[index]" type="text" placeholder="Artist name" />
        <button type="button" @click="removeArtist(index)" :disabled="artists.length === 1">
          Remove
        </button>
      </div>
      <button type="button" @click="addArtist">Add artist</button>
    </div>

    <div>
      <label>Format *</label>
      <select v-model="format">
        <option v-for="f in formatOptions" :key="f" :value="f">{{ f }}</option>
      </select>
    </div>

    <div>
      <label>Style *</label>
      <select v-model="style" multiple>
        <option v-for="s in styleOptions" :key="s.value" :value="s.value">
          {{ s.label }}
        </option>
      </select>
    </div>

    <div>
      <label>Year</label>
      <input v-model.number="year" type="number" placeholder="e.g. 1994" min="1900" max="2099" />
    </div>

    <div>
      <label>Label</label>
      <input v-model="label" type="text" placeholder="Record label" />
    </div>

    <div>
      <label>Country</label>
      <input v-model="country" type="text" placeholder="e.g. UK" />
    </div>

    <div>
      <label>Tracklist</label>
      <div v-for="(track, index) in tracks" :key="index">
        <span>{{ track.position }}</span>
        <input
          v-model="track.title"
          type="text"
          :placeholder="`Track ${track.position} title`"
        />
        <button type="button" @click="removeTrack(index)">Remove</button>
      </div>
      <button type="button" @click="addTrack">Add track</button>
    </div>

    <p v-if="error">{{ error }}</p>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Adding...' : 'Add release' }}
    </button>
  </form>
</template>
