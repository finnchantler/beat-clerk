<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { fetchReleases } = useReleases()

const syncLoading = ref<boolean>(false)
const syncError = ref<string | null>(null)
const syncProgress = ref<{ imported: number; total: number; title: string } | null>(null)
const syncComplete = ref<boolean>(false)

const syncCollection = () => {
  syncLoading.value = true
  syncError.value = null
  syncProgress.value = null
  syncComplete.value = false

  const source = new EventSource('api/discogs/sync')

  source.onmessage = async (event: MessageEvent) => {
    const data = JSON.parse(event.data)

    if (data.type === 'progress') {
      syncProgress.value = {
        imported: data.imported,
        total: data.total,
        title: data.title,
      }
      await fetchReleases()
    }

    if (data.type === 'error') {
      syncError.value = data.message
      syncLoading.value = false
      source.close()
    }
  }

  source.onerror = () => {
    syncError.value = 'Connection lost during sync'
    syncLoading.value = false
    source.close()
  }
}
</script>

<template>
  <HorizontalBar :sync-loading="syncLoading" @sync="syncCollection" />
  <div class="collection">
    <div class="collection__header">
      <h1 class="collection__title">Collection</h1>
    </div>

    <div v-if="syncProgress" class="sync__progress">
      <p>Syncing {{ syncProgress.imported }} of {{ syncProgress.total }}</p>
      <p class="sync__current">{{ syncProgress.title }}</p>
      <div class="sync__bar">
        <div
          class="sync__bar-fill"
          :style="{ width: `${(syncProgress.imported / syncProgress.total) * 100}%` }"
        />
      </div>
    </div>

    <p v-if="syncComplete" class="sync__success">Sync complete</p>

    <div v-if="syncError" class="sync__error">
      {{ syncError }}
      <NuxtLink v-if="syncError.includes('credentials')" to="/settings"> Go to settings </NuxtLink>
    </div>

    <ReleaseList />
  </div>
</template>

<style scoped>
.collection {
  padding: 30px;
}

.collection__header {
  margin-bottom: 20px;
}

.sync__progress {
  margin-bottom: 1rem;
}

.sync__current {
  font-size: 0.85rem;
  color: var(--colour-text-muted);
  margin: 0.25rem 0 0.5rem;
}

.sync__bar {
  height: 3px;
  background: var(--colour-border);
  border-radius: 2px;
  overflow: hidden;
}

.sync__bar-fill {
  height: 100%;
  background: var(--colour-text-primary);
  transition: width 0.3s ease;
}

.sync__success {
  font-size: 0.85rem;
  color: var(--colour-success);
  margin-bottom: 1rem;
}

.sync__error {
  font-size: 0.85rem;
  color: var(--colour-error);
  margin-bottom: 1rem;
}
</style>
