import { useRuntimeConfig } from '#app'

/**
 * Creates and returns an instance of fetch with the baseUrl and headers set
 * This must be called within a Vue component or composable
 */
export const useFetch = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  // Get tokens from localStorage - we can't use the auth composable here
  // because it would create a circular dependency
  const getTokens = () => {
    if (process.client) {
      const storedTokens = localStorage.getItem('auth_tokens')
      return storedTokens ? JSON.parse(storedTokens) : null
    }
    return null
  }

  // Check if token is expired
  const isTokenExpired = (tokens: any) => {
    if (!tokens || !tokens.access_token) return true

    // If tokens.expires_at exists and is in the past, token is expired
    if (tokens.expires_at && new Date(tokens.expires_at) < new Date()) {
      return true
    }

    return false
  }

  // Store updated tokens
  const storeTokens = (tokens: any) => {
    if (process.client && tokens) {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens))
    }
  }

  // Simple event system to notify about auth state changes
  const authEvents = {
    listeners: {} as Record<string, Function[]>,

    // Add event listener
    on(event: string, callback: Function) {
      if (!this.listeners[event]) {
        this.listeners[event] = []
      }
      this.listeners[event].push(callback)
    },

    // Remove event listener
    off(event: string, callback: Function) {
      if (!this.listeners[event]) return
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    },

    // Trigger event
    emit(event: string, ...args: any[]) {
      if (!this.listeners[event]) return
      this.listeners[event].forEach(callback => callback(...args))
    }
  }

  // Global flag to prevent multiple refresh attempts at once
  let isRefreshing = false
  let refreshPromise: Promise<boolean> | null = null

  // Function to refresh the token
  const refreshAccessToken = async () => {
    if (isRefreshing) {
      // If already refreshing, return the existing promise
      return refreshPromise
    }

    isRefreshing = true
    refreshPromise = new Promise(async resolve => {
      try {
        const tokens = getTokens()
        if (!tokens || !tokens.refresh_token) {
          // No refresh token available, can't refresh
          authEvents.emit('tokenRefreshFailed')
          resolve(false)
          return
        }

        // Call the refresh endpoint
        const response = await fetch(`${baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh_token: tokens.refresh_token })
        })

        if (!response.ok) {
          throw new Error('Token refresh failed')
        }

        const refreshData = await response.json()

        // Calculate expiration time and store it
        const expiresInMs = refreshData.expires_in * 1000
        const expiresAt = new Date(Date.now() + expiresInMs)

        // Update tokens in localStorage
        const newTokens = {
          ...refreshData,
          expires_at: expiresAt.toISOString()
        }

        storeTokens(newTokens)
        authEvents.emit('tokenRefreshed', newTokens)
        resolve(true)
      } catch (error) {
        console.error('Failed to refresh token:', error)
        // Clear tokens and notify app
        if (process.client) {
          localStorage.removeItem('auth_tokens')
        }
        authEvents.emit('tokenRefreshFailed')
        resolve(false)
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    })

    return refreshPromise
  }

  /**
   * Make a request to the API
   */
  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {})

    // Set default headers
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    // Check and refresh token if needed before making the request
    let tokens = getTokens()

    if (tokens) {
      // Check if token is expired
      if (isTokenExpired(tokens)) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          // Get the new tokens
          tokens = getTokens()
        } else {
          // Token refresh failed, proceed with request but it will likely fail
          // This will be handled in the 401 response handler below
        }
      }

      // Add authorization header if we have a token
      if (tokens?.access_token) {
        headers.set('Authorization', `Bearer ${tokens.access_token}`)
      }
    }

    const url = `${baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      // Handle authentication errors (401)
      if (response.status === 401) {
        // Try to refresh the token
        const refreshed = await refreshAccessToken()

        // If token refresh was successful, retry the request
        if (refreshed) {
          // Get updated tokens and retry the request
          tokens = getTokens()

          if (tokens?.access_token) {
            headers.set('Authorization', `Bearer ${tokens.access_token}`)

            const retryResponse = await fetch(url, {
              ...options,
              headers
            })

            if (!retryResponse.ok) {
              const error = await retryResponse
                .json()
                .catch(() => ({ detail: 'An unknown error occurred' }))
              throw new Error(error.detail || 'API request failed')
            }

            // Return JSON response if the Content-Type is application/json
            const contentType = retryResponse.headers.get('Content-Type')
            if (contentType && contentType.includes('application/json')) {
              return await retryResponse.json()
            }

            return await retryResponse.text()
          }
        }

        // If we get here, token refresh failed and we should notify about auth failure
        authEvents.emit('unauthorized')
        throw new Error('Unauthorized - Please log in again')
      }

      // Handle other non-2xx responses
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An unknown error occurred' }))
        throw new Error(error.detail || 'API request failed')
      }

      if (response.status === 204) {
        return null
      }

      // Return JSON response if the Content-Type is application/json
      const contentType = response.headers.get('Content-Type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return await response.text()
    } catch (error) {
      console.error(`API Error (${url}):`, error)
      throw error
    }
  }

  return {
    get: (endpoint: string, options: RequestInit = {}) =>
      fetchApi(endpoint, { ...options, method: 'GET' }),

    post: (endpoint: string, data: any, options: RequestInit = {}) =>
      fetchApi(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
      }),

    put: (endpoint: string, data: any, options: RequestInit = {}) =>
      fetchApi(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    patch: (endpoint: string, data: any, options: RequestInit = {}) =>
      fetchApi(endpoint, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data)
      }),

    delete: (endpoint: string, options: RequestInit = {}) =>
      fetchApi(endpoint, { ...options, method: 'DELETE' }),

    // Export auth events system
    authEvents
  }
}
