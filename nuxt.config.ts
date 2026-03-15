export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  srcDir: 'app/',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'beat-clerk',
    },
  },
  modules: ['@nuxt/eslint', '@nuxt/fonts'],
  fonts: {
    defaults: {
      weights: [200, 400, 600],
      styles: ['normal'],
    },
  },
})
