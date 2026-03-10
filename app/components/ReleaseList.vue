<script setup lang="ts">
const { releases, loading, error, fetchReleases, deleteRelease } = useReleases()

onMounted(async () => {
  await fetchReleases()
})

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to remove this release?')) return
  await deleteRelease(id)
}

const formatStyles = (styles: string[]) => {
  return styles.map((s) => s.replace(/_/g, ' ')).join(', ')
}
</script>

<template>
  <div>
    <p v-if="loading">Loading collection...</p>

    <p v-else-if="error">{{ error }}</p>

    <p v-else-if="releases.length === 0">Your collection is empty. Add your first release above.</p>

    <ul v-else>
      <li v-for="release in releases" :key="release.id">
        <div>
          <p>{{ release.artists.join(', ') }}</p>
          <h2>{{ release.title }}</h2>
          <p>{{ release.format }}</p>
          <p v-if="release.year">{{ release.year }}</p>
          <p v-if="release.label">{{ release.label }}</p>
          <p v-if="release.country">{{ release.country }}</p>
          <p>{{ formatStyles(release.style) }}</p>
        </div>

        <div v-if="release.tracks.length > 0">
          <ol>
            <li v-for="track in release.tracks" :key="track.id">
              {{ track.position }}. {{ track.title }}
            </li>
          </ol>
        </div>

        <button @click="handleDelete(release.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>
