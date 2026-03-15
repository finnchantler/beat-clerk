<script setup lang="ts">
import { Style } from '~/types/release'
import type { Release } from '~/types/release'

const props = defineProps<{
  release: Release
}>()

const emit = defineEmits<{
  updated: [release: Release]
}>()

const editingStyles = ref(false)
const selectedStyles = ref<Style[]>([...props.release.style])
const saveLoading = ref(false)
const saveError = ref<string | null>(null)

const styleOptions = Object.values(Style).map((s) => ({
  value: s,
  label: s.replace(/_/g, ' '),
}))

const formatArtists = (artists: string[]) => artists.join(', ')

const toggleStyle = (value: Style) => {
  const index = selectedStyles.value.indexOf(value)
  if (index === -1) {
    selectedStyles.value.push(value)
  } else {
    selectedStyles.value.splice(index, 1)
  }
}

const saveStyles = async () => {
  saveLoading.value = true
  saveError.value = null
  try {
    const updated = await $fetch<Release>(`/api/releases/${props.release.id}`, {
      method: 'PATCH',
      body: { style: selectedStyles.value },
    })
    editingStyles.value = false
    emit('updated', updated)
  } catch (e: any) {
    saveError.value = e?.data?.message ?? 'Failed to save styles'
  } finally {
    saveLoading.value = false
  }
}

const cancelEdit = () => {
  selectedStyles.value = [...props.release.style]
  editingStyles.value = false
  saveError.value = null
}
</script>

<template>
  <div class="release-detail">
    <div class="release-detail__hero">
      <div v-if="release.cover" class="release-detail__cover">
        <img :src="release.cover" :alt="`${release.title} cover`" />
      </div>
      <div class="release-detail__header">
        <h2 class="release-detail__title">{{ release.title }}</h2>
        <p class="release-detail__artists">{{ formatArtists(release.artists) }}</p>
        <dl class="release-detail__meta">
          <div v-if="release.country" class="release-detail__meta-row">
            <dt>Country</dt>
            <dd>{{ release.country }}</dd>
          </div>
          <div v-if="release.year" class="release-detail__meta-row">
            <dt>Year</dt>
            <dd>{{ release.year }}</dd>
          </div>
          <div v-if="release.format" class="release-detail__meta-row">
            <dt>Format</dt>
            <dd>{{ release.format }}</dd>
          </div>
          <div v-if="release.label" class="release-detail__meta-row">
            <dt>Label</dt>
            <dd>{{ release.label }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="release-detail__section">
      <div class="release-detail__section-header">
        <h3 class="release-detail__section-title">Styles</h3>
        <button
          v-if="!editingStyles"
          class="btn-reset icon-btn"
          @click="editingStyles = true"
          aria-label="Edit styles"
        >
          <VueFeather type="edit-2" size="14" class="edit-icon" />
        </button>
      </div>

      <div v-if="!editingStyles" class="release-detail__styles">
        <span
          v-if="release.style?.length"
          v-for="s in release.style"
          :key="s"
          class="style-chip style-chip--active"
        >
          {{ s.replace(/_/g, ' ') }}
        </span>
        <span v-else class="release-detail__empty">No styles added</span>
      </div>

      <div v-else>
        <div class="style-options">
          <button
            v-for="s in styleOptions"
            :key="s.value"
            type="button"
            :class="[
              'btn-reset',
              'style-chip',
              { 'style-chip--active': selectedStyles.includes(s.value) },
            ]"
            @click="toggleStyle(s.value)"
          >
            {{ s.label }}
          </button>
        </div>
        <p v-if="saveError" class="release-detail__error">{{ saveError }}</p>
        <div class="release-detail__edit-actions">
          <button class="btn-reset btn-ghost" @click="cancelEdit">Cancel</button>
          <button class="btn-reset btn-ghost" :disabled="saveLoading" @click="saveStyles">
            {{ saveLoading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="release.tracks?.length" class="release-detail__section">
      <h3 class="release-detail__section-title">Tracklist</h3>
      <div class="release-detail__tracklist">
        <div v-for="track in release.tracks" :key="track.id" class="release-detail__track">
          <span class="release-detail__track-position">{{ track.position }}</span>
          <span class="release-detail__track-title">{{ track.title }}</span>
        </div>
      </div>
    </div>

    <div v-else class="release-detail__section">
      <h3 class="release-detail__section-title">Tracklist</h3>
      <p class="release-detail__empty">No tracks added</p>
    </div>
  </div>
</template>

<style scoped>
.release-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.release-detail__hero {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.release-detail__cover {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.release-detail__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.release-detail__header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
}

.release-detail__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--colour-text-primary);
  margin: 0;
}

.release-detail__artists {
  font-size: 0.8rem;
  color: var(--colour-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.release-detail__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
  padding: 0;
}

.release-detail__meta-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.release-detail__meta-row dt {
  color: var(--colour-text-muted);
  min-width: 3.5rem;
}

.release-detail__meta-row dd {
  color: var(--colour-text-primary);
  margin: 0;
}

.release-detail__section {
  border-top: 1px solid var(--colour-border);
  padding-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.release-detail__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-btn {
  display: flex;
  align-items: center;
}

.edit-icon {
  color: var(--colour-text-primary);
}

.release-detail__section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--colour-text-muted);
  margin: 0;
}

.release-detail__styles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
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

.release-detail__edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.release-detail__tracklist {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.release-detail__track {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
}

.release-detail__track-position {
  font-size: 0.75rem;
  color: var(--colour-text-muted);
  min-width: 1.25rem;
  text-align: right;
  flex-shrink: 0;
}

.release-detail__track-title {
  font-size: 0.9rem;
  color: var(--colour-text-primary);
}

.release-detail__empty {
  font-size: 0.85rem;
  color: var(--colour-text-muted);
}

.release-detail__error {
  font-size: 0.8rem;
  color: var(--colour-error);
  margin-bottom: 0.5rem;
}

.btn-ghost {
  border: 1px solid var(--colour-border);
  color: var(--colour-text-muted);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  transition: all 0.15s;
}

.btn-ghost:hover:not(:disabled) {
  border-color: var(--colour-border-hover);
  color: var(--colour-text-primary);
}

.btn-ghost:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
