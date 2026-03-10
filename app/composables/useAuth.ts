import type { User, AuthResponse } from '~/types/auth'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)

  const loggedIn = computed(() => !!user.value)

  const register = async (email: string, username: string, password: string) => {
    const data = await $fetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: { email, username, password },
    })
    user.value = data.user
  }

  const login = async (email: string, password: string) => {
    const data = await $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
    user.value = null
  }

  const fetchUser = async () => {
    const headers = useRequestHeaders(['cookie'])
    user.value = await $fetch<User | null>('/api/auth/me', { headers })
  }

  return { user, loggedIn, register, login, logout, fetchUser }
}
