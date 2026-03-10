<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
})

const { register } = useAuth()
const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const handleSubmit = async () => {
  error.value = null

  if (!email.value || !username.value || !password.value || !confirmPassword.value) {
    error.value = 'All fields are required'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  if (username.value.length < 3) {
    error.value = 'Username must be at least 3 characters'
    return
  }

  loading.value = true

  try {
    await register(email.value, username.value, password.value)
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
    <h1>Create your beat-clerk account</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
        />
      </div>

      <div>
        <label for="username">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          autocomplete="username"
        />
      </div>

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="new-password"
        />
      </div>

      <div>
        <label for="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          autocomplete="new-password"
        />
      </div>

      <p v-if="error">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Create account' }}
      </button>
    </form>

    <p>Already have an account? <NuxtLink to="/login">Log in</NuxtLink></p>
  </div>
</template>
