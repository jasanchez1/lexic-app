// plugins/auth.ts
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { initAuth } = useAuth()
  
  // Only initialize auth on client-side to avoid localStorage errors
  if (process.client) {
    // Initialize auth after the app is mounted to ensure browser APIs are available
    nuxtApp.hook('app:mounted', async () => {
      await initAuth()
      
      // Periodically check authentication state (every 5 minutes)
      setInterval(async () => {
        const { tokens, refreshToken } = useAuth()
        if (tokens.value?.expires_at) {
          // Calculate time until expiration (subtract a 5-minute buffer)
          const expiresAt = new Date(tokens.value.expires_at).getTime()
          const now = Date.now()
          const expiresInMs = expiresAt - now - (5 * 60 * 1000) // 5 min buffer
          
          // If token will expire in less than 5 minutes, refresh it
          if (expiresInMs < 0) {
            console.log('Token expires soon, refreshing...')
            await refreshToken()
          }
        }
      }, 5 * 60 * 1000) // Check every 5 minutes
    })
  }
  
  return {
    provide: {
      // Can expose auth methods here if needed
    }
  }
})