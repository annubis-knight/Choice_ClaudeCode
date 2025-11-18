// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // Configuration PWA (à ajouter plus tard avec @vite-pwa/nuxt)
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/colors.css',
    '~/assets/css/main.css'
  ],

  // Auto-import des composables
  imports: {
    dirs: ['composables/**']
  },

  // Configuration Vite
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;'
        }
      }
    }
  }
})
