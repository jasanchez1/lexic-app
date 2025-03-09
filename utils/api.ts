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

  /**
   * Make a request to the API
   */
  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {})
    
    // Set default headers
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    
    // Add authorization header if we have a token
    const tokens = getTokens()
    if (tokens?.access_token) {
      headers.set('Authorization', `Bearer ${tokens.access_token}`)
    }
    
    const url = `${baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers
      })
      
      // Handle non-2xx responses
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An unknown error occurred' }))
        throw new Error(error.detail || 'API request failed')
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
      fetchApi(endpoint, { ...options, method: 'DELETE' })
  }
}