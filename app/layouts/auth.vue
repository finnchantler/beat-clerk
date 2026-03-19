<template>
  <div class="layout">
    <header class="layout__header">
      <NuxtLink to="/" class="logo">beat-clerk</NuxtLink>
    </header>
    <main class="layout__main">
      <slot />
    </main>
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

.layout__main {
  background-color: var(--colour-surface);
  border-radius: var(--radius-md);
  margin: 0 10px 10px;
  flex: 1;
  overflow-y: auto;
}
</style>
