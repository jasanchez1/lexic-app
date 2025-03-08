// composables/useAuth.ts
import { ref } from 'vue'

// User type definition
export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  is_active: boolean
  is_verified: boolean
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
} | null>(null)

// Get API URL from environment variable with fallback
const getApiUrl = () => {
  // Using runtime config (will need to be set up in nuxt.config.ts)
  const config = useRuntimeConfig()
  return config.public.apiUrl || 'https://ec2-15-229-42-136.sa-east-1.compute.amazonaws.com'
}

export const useAuth = () => {
  // Login function
  const login = async (email: string, password: string) => {
    authLoading.value = true
    authError.value = null

    try {
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Error al iniciar sesión')
      }

      const data = await response.json()
      
      // Store tokens
      tokens.value = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
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
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Error al crear cuenta')
      }

      const data = await response.json()
      
      // Store tokens
      tokens.value = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
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
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokens.value.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener perfil de usuario')
      }

      const userData = await response.json()
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
        const apiUrl = getApiUrl()
        await fetch(`${apiUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.value.access_token}`
          },
          body: JSON.stringify({
            refresh_token: tokens.value.refresh_token
          })
        })
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
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: tokens.value.refresh_token
        })
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      
      // Update tokens
      tokens.value = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
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
    login,
    signup,
    logout,
    initAuth,
    refreshToken,
    fetchUserProfile
  }
}