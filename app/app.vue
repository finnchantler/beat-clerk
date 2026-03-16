<script setup lang="ts">
const { init } = useAccentColour()
onMounted(init)
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
