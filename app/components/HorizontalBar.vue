<script setup lang="ts">
const { actions } = useHorizontalBar()
</script>

<template>
  <div class="bar">
    <button
      v-for="(action, i) in actions"
      :key="i"
      class="btn-reset icon-btn"
      :disabled="action.loading?.value"
      @click="action.onClick"
    >
      <VueFeather :type="action.icon" size="16" />
      {{ action.label }}
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
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
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
