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
    <ReleaseList />
  </div>
</template>
