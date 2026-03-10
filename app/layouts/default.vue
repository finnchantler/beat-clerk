<script setup lang="ts">
import Navigation from '~/components/Navigation.vue'
</script>
<template>
  <div class="layout">
    <header class="layout__header">
      <NuxtLink to="/" class="logo">beat-clerk</NuxtLink>
    </header>
    <div class="layout__body">
      <Navigation />
      <main class="layout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__header {
  text-align: center;
  padding: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.layout__body {
  display: flex;
  flex: 1;
}

.layout__main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
