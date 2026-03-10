<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div>
    <NuxtLink to="/">Back to index</NuxtLink>
    <AddReleaseForm />
  </div>
</template>