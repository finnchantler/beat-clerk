<script setup lang="ts">
import type { MatchResult } from '~/types/files'

definePageMeta({ middleware: 'auth' })

const {
  result,
  loading,
  error,
  agentConnected,
  checkStatus,
  browse,
  confirmMapping,
  dismissMapping,
} = useFileBrowser()

const confirmingMap = ref<string | null>(null)

const handleBrowse = async (path?: string) => {
  await browse(path)
}

const handleConfirm = async (match: MatchResult) => {
  if (!match.proposed) return
  confirmingMap.value = match.filePath
  try {
    await confirmMapping(match.proposed.trackId, match.filePath)
    dismissMapping(match.filePath)
  } finally {
    confirmingMap.value = null
  }
}

const confidenceLabel = (score: number) => {
  if (score >= 85) return 'High'
  if (score >= 60) return 'Medium'
  return 'Low'
}

onMounted(async () => {
  await checkStatus()
  if (agentConnected.value) {
    await browse()
  }
})
</script>

<template>
  <div class="files">
    <div v-if="!agentConnected" class="files__offline">
      <p>beat-clerk agent is not running.</p>
      <button @click="checkStatus" class="btn-ghost">Check again</button>
    </div>

    <div v-else>
      <div v-if="result" class="files__breadcrumb">
        <button
          v-if="result.currentPath !== result.rootDir"
          class="icon-btn"
          @click="handleBrowse(result.rootDir)"
          aria-label="Go to root"
        >
          <VueFeather type="home" size="14" />
        </button>
        <span class="files__path">{{ result.currentPath }}</span>
      </div>

      <p v-if="loading">Scanning files...</p>
      <p v-else-if="error">{{ error }}</p>

      <div v-else-if="result">
        <div v-if="result.dirs.length" class="files__dirs">
          <button
            v-for="dir in result.dirs"
            :key="dir.path"
            class="files__dir"
            @click="handleBrowse(dir.path)"
          >
            <VueFeather type="folder" size="14" />
            {{ dir.name }}
          </button>
        </div>

        <div v-if="result.matches.length" class="files__matches">
          <div v-for="match in result.matches" :key="match.filePath" class="files__match">
            <div class="files__match-file">
              <VueFeather type="music" size="14" />
              <span class="files__match-name">{{ match.fileName }}</span>
            </div>

            <div v-if="match.proposed" class="files__match-proposed">
              <div class="files__match-info">
                <span class="files__match-track">{{ match.proposed.trackTitle }}</span>
                <span class="files__match-release">
                  {{ match.proposed.artists.join(', ') }} — {{ match.proposed.releaseTitle }}
                </span>
                <span class="files__match-confidence">
                  {{ confidenceLabel(match.confidence) }} confidence ({{ match.confidence }}% via
                  {{ match.matchedOn }})
                </span>
              </div>

              <div class="files__match-actions">
                <button
                  class="icon-btn icon-btn--confirm"
                  :disabled="confirmingMap === match.filePath"
                  @click="handleConfirm(match)"
                  aria-label="Confirm mapping"
                >
                  <VueFeather type="check" size="14" />
                </button>
                <button
                  class="icon-btn"
                  @click="dismissMapping(match.filePath)"
                  aria-label="Dismiss"
                >
                  <VueFeather type="x" size="14" />
                </button>
              </div>
            </div>

            <div v-else class="files__match-unmatched">
              <span>No match found</span>
            </div>
          </div>
        </div>

        <p v-else-if="!result.dirs.length">No audio files found in this directory.</p>
      </div>
    </div>
  </div>
</template>
