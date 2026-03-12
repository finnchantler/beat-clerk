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

const view = 'grid'
</script>

<template>
  <div>
    <p v-if="loading">Loading collection...</p>

    <p v-else-if="error">{{ error }}</p>

    <p v-else-if="releases.length === 0">Your collection is empty. Add your first release above.</p>

    <div v-else :class="view === 'grid' ? 'releases-grid' : 'releases-list'">
      <ReleaseCard v-for="release in releases" :key="release.id" :release="release" :view="view" />
    </div>
  </div>
</template>

<style scoped>
.releases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.releases-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
