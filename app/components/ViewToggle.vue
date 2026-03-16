<script setup lang="ts">
import type { ViewMode } from '~/types/viewMode'

const props = defineProps<{ modelValue: ViewMode }>()
const emit = defineEmits<{ 'update:modelValue': [value: ViewMode] }>()
</script>

<template>
  <div class="view-toggle">
    <button
      class="btn-reset view-toggle__btn"
      :class="{ 'view-toggle__btn--active': modelValue === 'grid' }"
      title="Large tiles"
      @click="emit('update:modelValue', 'grid')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="0" y="0" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="8" y="0" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="0" y="8" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="8" y="8" width="6" height="6" rx="1" fill="currentColor" />
      </svg>
    </button>

    <button
      class="btn-reset view-toggle__btn"
      :class="{ 'view-toggle__btn--active': modelValue === 'grid-small' }"
      title="Small tiles"
      @click="emit('update:modelValue', 'grid-small')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="0" y="0" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
        <rect x="5.25" y="0" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
        <rect x="10.5" y="0" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
        <rect x="0" y="5.25" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
        <rect x="5.25" y="5.25" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
        <rect x="10.5" y="5.25" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
        <rect x="0" y="10.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
        <rect x="5.25" y="10.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
        <rect x="10.5" y="10.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
      </svg>
    </button>

    <button
      class="btn-reset view-toggle__btn"
      :class="{ 'view-toggle__btn--active': modelValue === 'list' }"
      title="List"
      @click="emit('update:modelValue', 'list')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="0" y="0" width="4" height="4" rx="0.5" fill="currentColor" />
        <rect x="6" y="1" width="8" height="2" rx="0.5" fill="currentColor" />
        <rect x="0" y="5" width="4" height="4" rx="0.5" fill="currentColor" />
        <rect x="6" y="6" width="8" height="2" rx="0.5" fill="currentColor" />
        <rect x="0" y="10" width="4" height="4" rx="0.5" fill="currentColor" />
        <rect x="6" y="11" width="8" height="2" rx="0.5" fill="currentColor" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.view-toggle {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--colour-background);
  border: 1px solid var(--colour-border);
  border-radius: var(--radius-sm);
  padding: 3px;
}

.view-toggle__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: calc(var(--radius-sm) - 2px);
  color: var(--colour-text-muted);
  transition:
    color 0.15s,
    background 0.15s;
}

.view-toggle__btn:hover {
  color: var(--colour-text-primary);
}

.view-toggle__btn--active {
  background: var(--colour-surface-dark);
  color: var(--colour-text-primary);
}
</style>
