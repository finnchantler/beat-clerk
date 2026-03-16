<script setup lang="ts">
import type { Release } from '~/types/release'
import type { ViewMode } from '~/types/viewMode'

const props = defineProps<{ viewMode: ViewMode }>()

const { releases, loading, error, fetchReleases, deleteRelease } = useReleases()

onMounted(async () => {
  await fetchReleases()
})

const selectedRelease = ref<Release | null>(null)

const handleUpdated = (updated: Release) => {
  const index = releases.value.findIndex((r) => r.id === updated.id)
  if (index !== -1) {
    releases.value[index] = updated
  }
}
</script>

<template>
  <div>
    <p v-if="loading">Loading collection...</p>

    <p v-else-if="error">{{ error }}</p>

    <p v-else-if="releases.length === 0">Your collection is empty. Add your first release above.</p>

    <div v-else :class="`releases--${viewMode}`">
      <ReleaseCard
        v-for="release in releases"
        :key="release.id"
        :release="release"
        :view="viewMode"
        @select="selectedRelease = $event"
      />
    </div>

    <Modal
      :open="selectedRelease !== null"
      :title="selectedRelease?.title"
      @close="selectedRelease = null"
    >
      <ReleaseDetail v-if="selectedRelease" :release="selectedRelease" @updated="handleUpdated" />
    </Modal>
  </div>
</template>

<style scoped>
.releases--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.releases--grid-small {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.releases--list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
