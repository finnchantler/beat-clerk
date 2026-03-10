<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}
</script>

<template>
  <div>
    <h1>Welcome to beat-clerk</h1>
    <NuxtLink to="/releases/add">Add release</NuxtLink>
    <button @click="handleLogout">Logout</button>
    <ReleaseList />
  </div>
</template>
