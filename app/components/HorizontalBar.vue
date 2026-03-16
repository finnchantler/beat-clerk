<script setup lang="ts">
import type { ButtonAction, SearchAction } from '~/composables/useHorizontalBar'

const { actions } = useHorizontalBar()
</script>

<template>
  <div class="bar">
    <template v-for="(action, i) in actions" :key="i">
      <input
        v-if="action.type === 'search'"
        :value="(action as SearchAction).getValue()"
        @input="(action as SearchAction).onUpdate(($event.target as HTMLInputElement).value)"
        :placeholder="(action as SearchAction).placeholder ?? 'Search...'"
        class="bar__search"
      />
      <button
        v-else-if="action.type === 'button'"
        class="btn-reset icon-btn"
        :disabled="(action as ButtonAction).loading?.value"
        @click="(action as ButtonAction).onClick"
      >
        <VueFeather :type="(action as ButtonAction).icon" size="16" />
        {{ (action as ButtonAction).label }}
      </button>
    </template>
    <div id="bar-right" class="bar__right" />
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
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  color: var(--colour-text-muted);
  display: flex;
  align-items: center;
  gap: 7px;
  transition: color 0.15s;
}

.icon-btn:hover {
  color: var(--colour-text-primary);
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bar__search {
  background: var(--colour-background);
  border: 1px solid var(--colour-border);
  border-radius: var(--radius-sm);
  color: var(--colour-text-primary);
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  outline: none;
  transition: border-color 0.15s;
  width: 220px;
}

.bar__search::placeholder {
  color: var(--colour-text-muted);
}

.bar__search:focus {
  border-color: var(--colour-text-muted);
}

.bar__right {
  margin-left: auto;
}
</style>
