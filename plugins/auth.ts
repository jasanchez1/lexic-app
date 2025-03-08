// plugins/auth.ts
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { initAuth } = useAuth()
  
  // Only initialize auth on client-side to avoid localStorage errors
  if (process.client) {
    // Initialize auth after the app is mounted to ensure browser APIs are available
    nuxtApp.hook('app:mounted', async () => {
      await initAuth()
    })
  }
  
  return {
    provide: {
      // Can expose auth methods here if needed
    }
  }
})