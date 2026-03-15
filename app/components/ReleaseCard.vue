<script setup lang="ts">
import type { Release } from '~/types/release'

const props = defineProps<{
  release: Release
  view: 'grid' | 'list'
}>()

const emit = defineEmits<{
  select: [release: Release]
}>()

const formatStyles = (styles: string[]) =>
  styles.map((style) => style.replace(/_/g, ' ')).join(', ')

const formatArtists = (artists: string[]) => artists.join(', ')
</script>

<template>
  <div :class="['release-card', `release-card--${view}`]" @click="emit('select', release)">
    <div v-if="release.cover" class="release-card__cover">
      <img :src="release.cover" :alt="`${release.title} cover`" />
    </div>

    <div class="release-card__details">
      <h2 class="release-card__title">{{ release.title }}</h2>
      <p class="release-card__artists">{{ formatArtists(release.artists) }}</p>

      <div class="release-card__meta">
        <span v-if="release.country">{{ release.country }}</span>
        <span v-if="release.year">{{ release.year }}</span>
        <span v-if="release.style?.length">{{ formatStyles(release.style) }}</span>
        <span v-if="release.format">{{ release.format }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base card */
.release-card {
  background: var(--colour-background);
  border: 1px solid var(--colour-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.15s;
}

/* Grid view */
.release-card--grid {
  display: flex;
  flex-direction: column;
}

.release-card--grid .release-card__cover {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.release-card--grid .release-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.release-card--grid .release-card__details {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

/* List view */
.release-card--list {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
}

.release-card--list .release-card__cover {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.release-card--list .release-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.release-card--list .release-card__details {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  min-width: 0;
}

/* Shared detail styles */
.release-card__artists {
  font-size: 0.75rem;
  color: var(--colour-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.release-card__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--colour-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.release-card__meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.release-card__meta span {
  font-size: 0.75rem;
  color: var(--colour-text-muted);
}

.release-card__meta span:not(:last-child)::after {
  content: '·';
  margin-left: 0.5rem;
  color: var(--colour-text-primary);
}
</style>
