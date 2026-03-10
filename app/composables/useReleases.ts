import type { Release, CreateReleaseInput } from '~/types/release'

export const useReleases = () => {
  const releases = useState<Release[]>('releases', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchReleases = async () => {
    loading.value = true
    error.value = null
    try {
      releases.value = await $fetch<Release[]>('/api/releases')
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to fetch releases'
    } finally {
      loading.value = false
    }
  }

  const addRelease = async (input: CreateReleaseInput) => {
    loading.value = true
    error.value = null
    try {
      const release = await $fetch<Release>('/api/releases', {
        method: 'POST',
        body: input,
      })
      releases.value = [release, ...releases.value]
      return release
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to add release'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteRelease = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/releases/${id}`, { method: 'DELETE' })
      releases.value = releases.value.filter((r) => r.id !== id)
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to delete release'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { releases, loading, error, fetchReleases, addRelease, deleteRelease }
}
