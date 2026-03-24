<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface WantlistItem {
  discogsReleaseId: number
  title: string
  artist: string
  cover: string | null
  watched: boolean
}

const items = ref<WantlistItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchWantlist = async () => {
  loading.value = true
  error.value = null
  try {
    items.value = await $fetch<WantlistItem[]>('/api/discogs/wantlist')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to fetch wantlist'
  } finally {
    loading.value = false
  }
}

const toggleWatch = async (item: WantlistItem) => {
  if (item.watched) {
    await unwatch(item)
  } else {
    await watch(item)
  }
}

const watch = async (item: WantlistItem) => {
  try {
    await $fetch('/api/watchlist', {
      method: 'POST',
      body: {
        discogsReleaseId: item.discogsReleaseId,
        title: item.title,
        artist: item.artist,
        cover: item.cover,
      },
    })
    item.watched = true
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to add to watchlist'
  }
}

const unwatch = async (item: WantlistItem) => {
  try {
    const watchlistItems =
      await $fetch<{ id: string; discogsReleaseId: number }[]>('/api/watchlist')
    const match = watchlistItems.find((w) => w.discogsReleaseId === item.discogsReleaseId)
    if (!match) return
    await $fetch(`/api/watchlist/${match.id}`, { method: 'DELETE' })
    item.watched = false
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to remove from watchlist'
  }
}

onMounted(fetchWantlist)
</script>

<template>
  <div class="wantlist">
    <div class="wantlist__header">
      <h1 class="wantlist__title">Discogs Wantlist</h1>
    </div>

    <p v-if="loading" class="wantlist__state">Loading wantlist...</p>
    <p v-else-if="error" class="wantlist__state wantlist__state--error">{{ error }}</p>
    <p v-else-if="items.length === 0" class="wantlist__state">Your wantlist is empty.</p>

    <div v-else class="wantlist__list">
      <div v-for="item in items" :key="item.discogsReleaseId" class="wantlist-item">
        <img v-if="item.cover" :src="item.cover" :alt="item.title" class="wantlist-item__cover" />
        <div v-else class="wantlist-item__cover wantlist-item__cover--placeholder" />

        <div class="wantlist-item__details">
          <p class="wantlist-item__artist">{{ item.artist }}</p>
          <p class="wantlist-item__title">{{ item.title }}</p>
        </div>

        <button
          class="btn-reset icon-btn"
          :class="{ 'icon-btn--active': item.watched }"
          :aria-label="item.watched ? 'Remove from watchlist' : 'Add to watchlist'"
          @click="toggleWatch(item)"
        >
          <VueFeather type="eye" size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wantlist {
  padding: 30px;
}

.wantlist__header {
  margin-bottom: 20px;
}

.wantlist__title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--colour-text-primary);
}

.wantlist__state {
  font-size: 0.85rem;
  color: var(--colour-text-muted);
}

.wantlist__state--error {
  color: var(--colour-error);
}

.wantlist__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.wantlist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--colour-surface-dark);
  transition: background 0.15s;
}

.wantlist-item:hover {
  background: var(--colour-surface-hover);
}

.wantlist-item__cover {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.wantlist-item__cover--placeholder {
  background: var(--colour-border);
}

.wantlist-item__details {
  flex: 1;
  min-width: 0;
}

.wantlist-item__artist {
  font-size: 0.75rem;
  color: var(--colour-text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wantlist-item__title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--colour-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
