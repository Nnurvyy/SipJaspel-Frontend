// jaspel-frontend/nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // Akan menggunakan var ini jika ada, jika tidak otomatis ikut server lokal
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8787/api'
    }
  }
})

