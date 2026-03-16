<script setup lang="ts">
import type { ViewMode } from '~/types/viewMode'

definePageMeta({
  middleware: 'auth',
})

const { fetchReleases } = useReleases()
const { setActions } = useHorizontalBar()

const viewMode = ref<ViewMode>('grid')
const addModalOpen = ref(false)
const searchQuery = ref('')
const debouncedQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout>

watch(searchQuery, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val
  }, 300)
})

onUnmounted(() => clearTimeout(debounceTimer))

const syncLoading = ref<boolean>(false)
const syncError = ref<string | null>(null)
const syncProgress = ref<{ imported: number; total: number; title: string } | null>(null)
const syncComplete = ref<boolean>(false)

setActions([
  {
    type: 'search',
    placeholder: 'Search by title or artist...',
    getValue: () => searchQuery.value,
    onUpdate: (val: string) => (searchQuery.value = val),
  },
  {
    type: 'button',
    icon: 'refresh-cw',
    label: 'Sync Discogs Collection',
    loading: syncLoading,
    onClick: () => syncCollection(),
  },
  {
    type: 'button',
    icon: 'plus-circle',
    label: 'Add Release',
    loading: null,
    onClick: () => {
      addModalOpen.value = true
    },
  },
])

const syncCollection = () => {
  syncLoading.value = true
  syncError.value = null
  syncProgress.value = null
  syncComplete.value = false

  const source = new EventSource('api/discogs/sync')
  let completed = false

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

    if (data.type === 'complete') {
      completed = true
      syncComplete.value = true
      syncLoading.value = false
      source.close()
    }

    if (data.type === 'error') {
      completed = true
      syncError.value = data.message
      syncLoading.value = false
      source.close()
    }
  }

  source.onerror = () => {
    if (completed) return
    syncError.value = 'Connection lost during sync'
    syncLoading.value = false
    source.close()
  }
}
</script>

<template>
  <Teleport to="#bar-right">
    <ViewToggle v-model="viewMode" />
  </Teleport>

  <Modal :open="addModalOpen" title="Add Release" @close="addModalOpen = false">
    <AddReleaseForm @added="addModalOpen = false" />
  </Modal>

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

    <ReleaseList :view-mode="viewMode" :search="debouncedQuery" />
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
