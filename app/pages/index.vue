<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { fetchReleases } = useReleases()

const syncLoading = ref(false)
const syncError = ref<string | null>(null)
const syncResult = ref<{ imported: number } | null>(null)

const syncCollection = async () => {
  syncLoading.value = true
  syncError.value = null
  syncResult.value = null
  try {
    syncResult.value = await $fetch<{ imported: number }>('/api/discogs/import', {
      method: 'POST',
    })
    await fetchReleases()
  } catch (e: any) {
    syncError.value = e?.data?.message ?? 'Sync failed'
  } finally {
    syncLoading.value = false
  }
}
</script>

<template>
  <HorizontalBar :sync-loading="syncLoading" @sync="syncCollection" />
  <div class="collection">
    <div class="collection__header">
      <h1 class="collection__title">Collection</h1>
    </div>

    <div v-if="syncError" class="collection__sync-error">
      {{ syncError }}
      <NuxtLink v-if="syncError.includes('credentials')" to="/settings"> Go to settings </NuxtLink>
    </div>

    <p v-if="syncResult" class="collection__sync-success">
      Imported {{ syncResult.imported }} releases.
    </p>

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
</style>
