import { ref } from 'vue'
import { useAuthService } from '~/services/api'
import { useFetch } from '~/utils/api'

// User type definition
export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  isActive: boolean
  is_verified: boolean
  createdAt: string
  updatedAt: string
  lawyerId?: string | null
  isLawyer?: boolean
}

// Auth state
const user = ref<User | null>(null)
const isAuthenticated = ref(false)
const authLoading = ref(false)
const authError = ref<string | null>(null)
const userLoaded = ref(false)
const loginAction = ref(false) // Track explicit login actions
const logoutAction = ref(false) // Track explicit logout actions
const tokens = ref<{
  access_token: string
  refresh_token: string
  expires_in: number
  user_id: string
  token_type: string
  expires_at?: string
} | null>(null)

export const useAuth = () => {
  const authService = useAuthService()
  const api = useFetch()

  // Auto-refresh tokens on expiration
  const setupTokenRefresh = () => {
    if (process.client) {
      // Listen for token refresh events
      api.authEvents.on('tokenRefreshed', (newTokens: any) => {
        tokens.value = newTokens
        isAuthenticated.value = true
      })

      // Listen for refresh failures
      api.authEvents.on('tokenRefreshFailed', () => {
        logout(false) // Silent logout, don't trigger notification
      })

      // Listen for unauthorized responses
      api.authEvents.on('unauthorized', () => {
        logout(false) // Silent logout, don't trigger notification
      })
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    authLoading.value = true
    authError.value = null
    userLoaded.value = false
    loginAction.value = false // Reset login action flag

    try {
      const data = await authService.login(email, password)

      // Calculate expiration time and store it
      const expiresInMs = data.expiresIn * 1000
      const expiresAt = new Date(Date.now() + expiresInMs)

      // Store tokens
      tokens.value = {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        expires_in: data.expiresIn,
        user_id: data.userId,
        token_type: data.tokenType || 'bearer',
        expires_at: expiresAt.toISOString()
      }

      // Store tokens in localStorage for persistence (client-side only)
      if (process.client) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens.value))
      }

      // Set authenticated state
      isAuthenticated.value = true

      // Fetch user details before returning
      await fetchUserProfile()

      // Set login action flag to trigger toast notification
      loginAction.value = true

      return { success: true, data }
    } catch (error) {
      console.error('Login error:', error)
      authError.value = error instanceof Error ? error.message : 'Error desconocido'
      return { success: false, error: authError.value }
    } finally {
      authLoading.value = false
    }
  }

  // Sign up function
  const signup = async (email: string, password: string, firstName: string, lastName: string, isLawyer: string) => {
    authLoading.value = true
    authError.value = null
    userLoaded.value = false
    loginAction.value = false 

    try {
      const data = await authService.signup(email, password, firstName, lastName, isLawyer)

      // Calculate expiration time and store it
      const expiresInMs = data.expiresIn * 1000
      const expiresAt = new Date(Date.now() + expiresInMs)

      // Store tokens
      tokens.value = {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        expires_in: data.expiresIn,
        user_id: data.userId,
        token_type: data.tokenType || 'bearer',
        expires_at: expiresAt.toISOString()
      }

      // Store tokens in localStorage for persistence (client-side only)
      if (process.client) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens.value))
      }

      // Set authenticated state
      isAuthenticated.value = true

      // Fetch user details before returning
      await fetchUserProfile()

      // Set login action flag to trigger toast notification
      loginAction.value = true

      return { success: true, data }
    } catch (error) {
      console.error('Signup error:', error)
      authError.value = error instanceof Error ? error.message : 'Error desconocido'
      return { success: false, error: authError.value }
    } finally {
      authLoading.value = false
    }
  }

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!tokens.value) return null

    try {
      // Skip fetching if already logged out
      if (!isAuthenticated.value) return null

      const userData = await authService.getCurrentUser()
      user.value = userData
      userLoaded.value = true
      return userData
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Logout function
  const logout = async (showNotification = true) => {
    authLoading.value = true
    logoutAction.value = false // Reset logout action flag

    try {
      if (tokens.value?.refresh_token) {
        // Call logout endpoint
        await authService.logout(tokens.value.refresh_token)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear auth state regardless of API result
      user.value = null
      tokens.value = null
      isAuthenticated.value = false
      userLoaded.value = false

      if (process.client) {
        localStorage.removeItem('auth_tokens')
      }

      // Set logout action flag if notification should be shown
      if (showNotification) {
        logoutAction.value = true
      }

      authLoading.value = false
    }
  }

  // Initialize auth state from localStorage on page load
  const initAuth = async () => {
    // Only access localStorage on the client side
    if (process.client) {
      setupTokenRefresh()

      const storedTokens = localStorage.getItem('auth_tokens')

      if (storedTokens) {
        try {
          authLoading.value = true
          tokens.value = JSON.parse(storedTokens)

          // Check if token is expired
          if (tokens.value?.expires_at && new Date(tokens.value.expires_at) < new Date()) {
            // Token is expired, try to refresh
            const refreshed = await refreshToken()
            if (!refreshed) {
              // Refresh failed, logout silently
              await logout(false)
              authLoading.value = false
              return
            }
          }

          isAuthenticated.value = true
          await fetchUserProfile()
          authLoading.value = false
        } catch (error) {
          console.error('Error initializing auth:', error)
          await logout(false) // Clear invalid auth state, silently
          authLoading.value = false
        }
      } else {
        authLoading.value = false
      }
    }
  }

  // Refresh token
  const refreshToken = async () => {
    if (!tokens.value?.refresh_token) return false

    try {
      const data = await authService.refreshToken(tokens.value.refresh_token)

      // Calculate expiration time
      const expiresInMs = data.expiresIn * 1000
      const expiresAt = new Date(Date.now() + expiresInMs)

      // Update tokens
      tokens.value = {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        expires_in: data.expiresIn,
        user_id: data.userId,
        token_type: data.tokenType || 'bearer',
        expires_at: expiresAt.toISOString()
      }

      // Update localStorage (client-side only)
      if (process.client) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens.value))
      }

      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      logout(false) // Clear auth state on refresh failure, silently
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    authLoading,
    authError,
    tokens,
    userLoaded,
    loginAction,
    logoutAction,
    login,
    signup,
    logout,
    initAuth,
    refreshToken,
    fetchUserProfile
  }
}
