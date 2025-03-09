// utils/apiServiceFactory.ts
import { useFetch } from '~/utils/api'

/**
 * Creates a standard CRUD service for a resource
 * This function must be called within a Vue component or composable
 * 
 * @param resourcePath The base path for the resource (e.g., '/lawyers')
 * @returns An object with methods for interacting with the resource
 */
export const createApiService = <T, CreateT = any, UpdateT = any>(resourcePath: string) => {
  const api = useFetch()
  
  return {
    /**
     * Get a list of resources
     * @param params Query parameters
     * @returns Array of resources
     */
    list: async (params?: Record<string, any>) => {
      let queryString = ''
      if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })
        queryString = `?${searchParams.toString()}`
      }
      
      return await api.get(`${resourcePath}${queryString}`) as T[]
    },
    
    /**
     * Get a specific resource by ID
     * @param id Resource ID
     * @returns The resource
     */
    get: async (id: string) => {
      return await api.get(`${resourcePath}/${id}`) as T
    },
    
    /**
     * Create a new resource
     * @param data Resource data
     * @returns The created resource
     */
    create: async (data: CreateT) => {
      return await api.post(`${resourcePath}/`, data) as T
    },
    
    /**
     * Update a resource
     * @param id Resource ID
     * @param data Resource data
     * @returns The updated resource
     */
    update: async (id: string, data: UpdateT) => {
      return await api.patch(`${resourcePath}/${id}`, data) as T
    },
    
    /**
     * Delete a resource
     * @param id Resource ID
     * @returns void
     */
    delete: async (id: string) => {
      return await api.delete(`${resourcePath}/${id}`)
    },
    
    /**
     * Custom API call for endpoints that don't follow the standard pattern
     * @param method HTTP method
     * @param path Resource sub-path (appended to the resourcePath)
     * @param data Optional data for POST, PUT, PATCH
     * @param params Optional query parameters
     * @returns Response data
     */
    custom: async (
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      path: string,
      data?: any,
      params?: Record<string, any>
    ) => {
      let queryString = ''
      if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })
        queryString = `?${searchParams.toString()}`
      }
      
      const fullPath = `${resourcePath}${path}${queryString}`
      
      switch (method) {
        case 'GET':
          return await api.get(fullPath)
        case 'POST':
          return await api.post(fullPath, data)
        case 'PUT':
          return await api.put(fullPath, data)
        case 'PATCH':
          return await api.patch(fullPath, data)
        case 'DELETE':
          return await api.delete(fullPath)
      }
    }
  }
}