import { ref } from 'vue'
import { useAuthService } from '~/services/api'

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
}

// Auth state
const user = ref<User | null>(null)
const isAuthenticated = ref(false)
const authLoading = ref(false)
const authError = ref<string | null>(null)
const tokens = ref<{
  access_token: string
  refresh_token: string
  expires_in: number
  user_id: string
  token_type: string
} | null>(null)

export const useAuth = () => {
  const authService = useAuthService()

  // Login function
  const login = async (email: string, password: string) => {
    authLoading.value = true
    authError.value = null

    try {
      const data = await authService.login(email, password)
      
      // Store tokens
      tokens.value = {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        expires_in: data.expiresIn,
        user_id: data.userId,
        token_type: data.tokenType || 'bearer'
      }
      
      // Store tokens in localStorage for persistence (client-side only)
      if (process.client) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens.value))
      }
      
      // Set authenticated state
      isAuthenticated.value = true
      
      // Fetch user details
      await fetchUserProfile()
      
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
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    authLoading.value = true
    authError.value = null

    try {
      const data = await authService.signup(email, password, firstName, lastName)
      
      // Store tokens
      tokens.value = {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        expires_in: data.expiresIn,
        user_id: data.userId,
        token_type: data.tokenType || 'bearer'
      }
      
      // Store tokens in localStorage for persistence (client-side only)
      if (process.client) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens.value))
      }
      
      // Set authenticated state
      isAuthenticated.value = true
      
      // Fetch user details
      await fetchUserProfile()
      
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
      const userData = await authService.getCurrentUser()
      user.value = userData
      return userData
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Logout function
  const logout = async () => {
    authLoading.value = true

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
      if (process.client) {
        localStorage.removeItem('auth_tokens')
      }
      authLoading.value = false
    }
  }

  // Initialize auth state from localStorage on page load
  const initAuth = async () => {
    // Only access localStorage on the client side
    if (process.client) {
      const storedTokens = localStorage.getItem('auth_tokens')
      
      if (storedTokens) {
        try {
          tokens.value = JSON.parse(storedTokens)
          isAuthenticated.value = true
          await fetchUserProfile()
        } catch (error) {
          console.error('Error initializing auth:', error)
          logout() // Clear invalid auth state
        }
      }
    }
  }

  // Refresh token
  const refreshToken = async () => {
    if (!tokens.value?.refresh_token) return false

    try {
      const data = await authService.refreshToken(tokens.value.refresh_token)
      
      // Update tokens
      tokens.value = {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        expires_in: data.expiresIn,
        user_id: data.userId,
        token_type: data.tokenType || 'bearer'
      }
      
      // Update localStorage (client-side only)
      if (process.client) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens.value))
      }
      
      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      logout() // Clear auth state on refresh failure
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    authLoading,
    authError,
    tokens,
    login,
    signup,
    logout,
    initAuth,
    refreshToken,
    fetchUserProfile
  }
}