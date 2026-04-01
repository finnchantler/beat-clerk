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
    <div class="files__header">
      <h1 class="files__title">Local Files</h1>
    </div>

    <div v-if="!agentConnected" class="files__offline">
      <p class="files__state">beat-clerk agent is not running.</p>
      <button class="btn-reset icon-btn" @click="checkStatus">Check again</button>
    </div>

    <div v-else>
      <div v-if="result" class="files__breadcrumb">
        <button
          v-if="result.currentPath !== result.rootDir"
          class="btn-reset icon-btn"
          aria-label="Go to root"
          @click="handleBrowse(result.rootDir)"
        >
          <VueFeather type="home" size="14" />
        </button>
        <span class="files__path">{{ result.currentPath }}</span>
      </div>

      <p v-if="loading" class="files__state">Scanning files...</p>
      <p v-else-if="error" class="files__state files__state--error">{{ error }}</p>

      <div v-else-if="result">
        <div v-if="result.dirs.length" class="files__dirs">
          <button
            v-for="dir in result.dirs"
            :key="dir.path"
            class="btn-reset files__dir"
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
                  class="btn-reset icon-btn icon-btn--confirm"
                  :disabled="confirmingMap === match.filePath"
                  aria-label="Confirm mapping"
                  @click="handleConfirm(match)"
                >
                  <VueFeather type="check" size="14" />
                </button>
                <button
                  class="btn-reset icon-btn"
                  aria-label="Dismiss"
                  @click="dismissMapping(match.filePath)"
                >
                  <VueFeather type="x" size="14" />
                </button>
              </div>
            </div>

            <div v-else class="files__match-unmatched">
              <span class="files__state">No match found</span>
            </div>
          </div>
        </div>

        <p v-else-if="!result.dirs.length" class="files__state">
          No audio files found in this directory.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.files {
  padding: 30px;
}

.files__header {
  margin-bottom: 20px;
}

.files__title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--colour-text-primary);
}

.files__state {
  font-size: 0.85rem;
  color: var(--colour-text-muted);
}

.files__state--error {
  color: var(--colour-error);
}

.files__offline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.files__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.files__path {
  font-size: 0.8rem;
  color: var(--colour-text-muted);
  font-family: monospace;
}

.files__dirs {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.files__dir {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--colour-surface-dark);
  color: var(--colour-text-muted);
  font-size: 0.875rem;
  text-align: left;
  transition:
    background 0.15s,
    color 0.15s;
  cursor: pointer;
}

.files__dir:hover {
  background: var(--colour-border);
  color: var(--colour-text-primary);
}

.files__matches {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.files__match {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: var(--colour-surface-dark);
}

.files__match-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--colour-text-muted);
}

.files__match-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--colour-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.files__match-proposed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--colour-border);
}

.files__match-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.files__match-track {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--colour-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.files__match-release {
  font-size: 0.8rem;
  color: var(--colour-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.files__match-confidence {
  font-size: 0.75rem;
  color: var(--colour-text-muted);
  opacity: 0.7;
}

.files__match-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.files__match-unmatched {
  padding-top: 0.5rem;
  border-top: 1px solid var(--colour-border);
}
</style>
