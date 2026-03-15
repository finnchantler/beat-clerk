<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

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
      <h2 class="settings__section-title">Discogs Integration</h2>
      <p class="settings__description">
        Add your Discogs username and personal access token to import your collection. You can
        generate a token in your
        <a href="https://www.discogs.com/settings/developers" target="_blank">
          Discogs developer settings </a
        >.
      </p>

      <form @submit.prevent="saveDiscogs" class="settings__form">
        <div class="settings__field">
          <label for="discogsUsername">Discogs Username</label>
          <input
            id="discogsUsername"
            v-model="discogsUsername"
            type="text"
            placeholder="your_discogs_username"
          />
        </div>

        <div class="settings__field">
          <label for="discogsToken">Personal Access Token</label>
          <input
            id="discogsToken"
            v-model="discogsToken"
            type="password"
            placeholder="••••••••••••••••"
          />
        </div>

        <p v-if="saveError" class="settings__error">{{ saveError }}</p>
        <p v-if="saveSuccess" class="settings__success">Discogs credentials saved.</p>

        <button type="submit" :disabled="saveLoading">
          {{ saveLoading ? 'Saving...' : 'Save credentials' }}
        </button>
      </form>
    </section>
  </div>
</template>
