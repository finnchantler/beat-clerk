<script setup lang="ts">
import SidebarNavigation from '~/components/SidebarNavigation.vue'
</script>
<template>
  <div class="layout">
    <header class="layout__header">
      <NuxtLink to="/" class="logo">beat-clerk</NuxtLink>
    </header>
    <div class="layout__body">
      <SidebarNavigation />
      <main class="layout__main">
        <div class="layout__content">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.layout__header {
  text-align: center;
  padding: 10px 0;
}

.layout__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.layout__main {
  background-color: var(--colour-surface);
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  flex: 1;
  overflow-y: auto;
}
</style>
