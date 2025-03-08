import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  components: true,
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  pages: true,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    // Private keys that are exposed only on the server
    apiSecret: process.env.API_SECRET || 'default_secret',
    
    // Public keys that are exposed to the client
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://ec2-15-229-42-136.sa-east-1.compute.amazonaws.com'
    }
  },
  // Add plugin to initialize auth on app start
  plugins: [
    '~/plugins/auth.ts'
  ]
})