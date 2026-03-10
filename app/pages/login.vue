<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
})

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const handleSubmit = async () => {
  error.value = null

  if (!email.value || !password.value) {
    error.value = 'All fields are required'
    return
  }

  loading.value = true

  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1>Log in to beat-clerk</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="email" />
      </div>

      <div>
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" autocomplete="current-password" />
      </div>

      <p v-if="error">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Log in' }}
      </button>
    </form>

    <p>Don't have an account? <NuxtLink to="/register">Register</NuxtLink></p>
  </div>
</template>
