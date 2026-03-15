<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const barItems = []

const isActive = (path: string) => route.path === path

const props = defineProps<{ syncLoading?: boolean }>()
const emit = defineEmits<{ sync: [] }>()
</script>

<template>
  <div class="bar">
    <button @click="emit('sync')" :disabled="props.syncLoading" class="icon-btn">
      <VueFeather type="refresh-cw" size="16" />
      Sync Discogs Collection
    </button>
  </div>
</template>

<style scoped>
.bar {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 50px;
  background-color: var(--colour-surface-dark);
  width: 100%;
  padding: 18px;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--colour-text-primary);
  display: flex;
  align-items: center;
  gap: 7px;
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
