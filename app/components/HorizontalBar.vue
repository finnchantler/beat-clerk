<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const barItems = []

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="bar"></div>
</template>

<style scoped>
.bar {
  height: 50px;
  background-color: var(--colour-surface-dark);
  width: 100%;
}
</style>
