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

const toggleStyle = (value: Style) => {
  const index = style.value.indexOf(value)
  if (index === -1) {
    style.value.push(value)
  } else {
    style.value.splice(index, 1)
  }
}

const styleOptions = Object.values(Style).map((s) => ({
  value: s,
  label: s.replace(/_/g, ' '),
}))

const formatOptions = Object.values(Format)
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-field">
      <label>Title *</label>
      <input v-model="title" type="text" placeholder="Release title" />
    </div>

    <div class="form-field">
      <label>Artists *</label>
      <div v-for="(_, index) in artists" :key="index">
        <input v-model="artists[index]" type="text" placeholder="Artist name" />
        <button
          class="btn-reset btn-danger"
          type="button"
          @click="removeArtist(index)"
          :disabled="artists.length === 1"
        >
          Remove
        </button>
      </div>
      <button class="btn-reset btn-ghost" type="button" @click="addArtist">Add artist</button>
    </div>

    <div class="form-field">
      <label>Format *</label>
      <select v-model="format">
        <option v-for="f in formatOptions" :key="f" :value="f">{{ f }}</option>
      </select>
    </div>

    <div class="style-options">
      <button
        v-for="s in styleOptions"
        :key="s.value"
        type="button"
        :class="['btn-reset', 'style-chip', { 'style-chip--active': style.includes(s.value) }]"
        @click="toggleStyle(s.value)"
      >
        {{ s.label }}
      </button>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label>Year</label>
        <input v-model.number="year" type="number" placeholder="e.g. 1994" min="1900" max="2099" />
      </div>
      <div class="form-field">
        <label>Country</label>
        <input v-model="country" type="text" placeholder="e.g. UK" />
      </div>
    </div>

    <div class="form-field">
      <label>Label</label>
      <input v-model="label" type="text" placeholder="Record label" />
    </div>

    <div class="form-field">
      <label>Tracklist</label>
      <div v-for="(track, index) in tracks" :key="index">
        <input v-model="track.title" type="text" :placeholder="`Track ${track.position} title`" />
        <button class="btn-reset btn-danger" type="button" @click="removeTrack(index)">
          Remove
        </button>
      </div>
      <button class="btn-reset btn-ghost" type="button" @click="addTrack">Add track</button>
    </div>

    <p v-if="error">{{ error }}</p>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Adding...' : 'Add release' }}
    </button>
  </form>
</template>

<style scoped>
.style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.style-chip {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--colour-border);
  color: var(--colour-text-muted);
  font-size: 0.8rem;
  transition: all 0.15s;
}

.style-chip--active {
  border-color: var(--colour-text-primary);
  color: var(--colour-text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

input,
select {
  padding: 0.6rem 0.75rem;
  background: var(--colour-background);
  border: 1px solid var(--colour-border);
  border-radius: var(--radius-sm);
  color: var(--colour-text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}

input:focus,
select:focus {
  border-color: var(--colour-border-hover);
}

.btn-ghost {
  border: 1px solid var(--colour-border);
  color: var(--colour-text-muted);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  transition: all 0.15s;
}

.btn-ghost:hover {
  border-color: var(--colour-border-hover);
  color: var(--colour-text-primary);
}

.btn-danger {
  color: var(--colour-text-muted);
  font-size: 0.75rem;
  transition: color 0.15s;
  padding: 0 0.25rem;
}

.btn-danger:hover {
  color: var(--colour-error);
}

label {
  font-size: 0.8rem;
  color: var(--colour-text-muted);
  font-weight: 500;
}
</style>
