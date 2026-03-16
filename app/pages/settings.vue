<script setup lang="ts">
import { ACCENT_COLOURS } from '~/composables/useAccentColour'
import type { AccentColour } from '~/composables/useAccentColour'

definePageMeta({ middleware: 'auth' })

const { accentColour, setColour } = useAccentColour()

const discogsUsername = ref('')
const discogsToken = ref('')
const saveLoading = ref(false)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

const saveDiscogs = async () => {
  saveError.value = null
  saveSuccess.value = false
  saveLoading.value = true
  try {
    await $fetch('/api/settings/discogs', {
      method: 'POST',
      body: { discogsUsername: discogsUsername.value, discogsToken: discogsToken.value },
    })
    saveSuccess.value = true
  } catch (e: any) {
    saveError.value = e?.data?.message ?? 'Something went wrong'
  } finally {
    saveLoading.value = false
  }
}
</script>

<template>
  <div class="settings">
    <h1 class="settings__title">Settings</h1>

    <section class="settings__section">
      <h2 class="settings__section-title">Appearance</h2>
      <p class="settings__description">Choose an accent colour for the background gradient.</p>
      <div class="accent-swatches">
        <button
          v-for="colour in ACCENT_COLOURS"
          :key="colour.value"
          class="btn-reset accent-swatch"
          :class="{ 'accent-swatch--active': accentColour === colour.value }"
          :style="{ background: colour.value }"
          :title="colour.label"
          @click="setColour(colour.value as AccentColour)"
        />
      </div>
    </section>

    <section class="settings__section">
      <h2 class="settings__section-title">Discogs Integration</h2>
      <p class="settings__description">
        Add your Discogs username and personal access token to import your collection. You can
        generate a token in your
        <a href="https://www.discogs.com/settings/developers" target="_blank">
          Discogs developer settings </a
        >.
      </p>

      <form @submit.prevent="saveDiscogs">
        <div class="form-field">
          <label for="discogsUsername">Discogs Username</label>
          <input
            id="discogsUsername"
            v-model="discogsUsername"
            type="text"
            placeholder="your_discogs_username"
          />
        </div>

        <div class="form-field">
          <label for="discogsToken">Personal Access Token</label>
          <input
            id="discogsToken"
            v-model="discogsToken"
            type="password"
            placeholder="••••••••••••••••"
          />
        </div>

        <p v-if="saveError" class="error">{{ saveError }}</p>
        <p v-if="saveSuccess" class="success">Discogs credentials saved.</p>

        <button class="btn-reset btn-submit" type="submit" :disabled="saveLoading">
          {{ saveLoading ? 'Saving...' : 'Save credentials' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.settings {
  padding: 30px;
  max-width: 560px;
}

.settings__title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--colour-text-primary);
}

.settings__section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--colour-border);
}

.settings__section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.settings__section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--colour-text-primary);
}

.settings__description {
  font-size: 0.85rem;
  color: var(--colour-text-muted);
  line-height: 1.5;
}

.settings__description a {
  color: var(--colour-text-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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

.btn-submit {
  align-self: flex-start;
  border: 1px solid var(--colour-border);
  color: var(--colour-text-muted);
  padding: 0.45rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  transition:
    border-color 0.15s,
    color 0.15s;
}

.btn-submit:hover:not(:disabled) {
  border-color: var(--colour-border-hover);
  color: var(--colour-text-primary);
}

.btn-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.error {
  font-size: 0.85rem;
  color: var(--colour-error);
}

.success {
  font-size: 0.85rem;
  color: var(--colour-success);
}

.accent-swatches {
  display: flex;
  gap: 10px;
  margin-top: 0.75rem;
}

.accent-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  box-shadow: 0 0 0 2px transparent;
}

.accent-swatch:hover {
  transform: scale(1.1);
}

.accent-swatch--active {
  box-shadow: 0 0 0 2px var(--colour-text-primary);
}
</style>
