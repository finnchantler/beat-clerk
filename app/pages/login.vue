<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: 'auth',
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
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Log in to beat-clerk</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" autocomplete="email" />
        </div>

        <div class="form-field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" autocomplete="current-password" />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button class="btn-reset btn-submit" type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Log in' }}
        </button>
      </form>

      <p class="auth-footer">Don't have an account? <NuxtLink to="/register">Register</NuxtLink></p>
    </div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

label {
  font-size: 0.8rem;
  color: var(--colour-text-muted);
  font-weight: 500;
}

input {
  padding: 0.6rem 0.75rem;
  background: var(--colour-background);
  border: 1px solid var(--colour-border);
  border-radius: var(--radius-sm);
  color: var(--colour-text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}

input:focus {
  border-color: var(--colour-border-hover);
}
</style>
