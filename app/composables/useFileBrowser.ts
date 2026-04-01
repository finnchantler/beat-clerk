import type { MatchResult } from '~/types/files'

interface Dir {
  path: string
  name: string
}

interface BrowseResult {
  matches: MatchResult[]
  dirs: Dir[]
  currentPath: string
  rootDir: string
}

export const useFileBrowser = () => {
  const result = ref<BrowseResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const agentConnected = ref(false)

  const checkStatus = async () => {
    try {
      const status = await $fetch<{ connected: boolean }>('/api/agent/status')
      agentConnected.value = status.connected
    } catch {
      agentConnected.value = false
    }
  }

  const browse = async (path?: string) => {
    loading.value = true
    error.value = null
    try {
      result.value = await $fetch<BrowseResult>('/api/agent/match', {
        query: path ? { path } : {},
      })
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Failed to browse'
    } finally {
      loading.value = false
    }
  }

  const confirmMapping = async (trackId: string, filePath: string) => {
    await $fetch('/api/agent/map', {
      method: 'POST',
      body: { trackId, filePath },
    })
  }

  const dismissMapping = (filePath: string) => {
    if (!result.value) return
    result.value.matches = result.value.matches.filter((m) => m.filePath !== filePath)
  }

  return {
    result,
    loading,
    error,
    agentConnected,
    checkStatus,
    browse,
    confirmMapping,
    dismissMapping,
  }
}
