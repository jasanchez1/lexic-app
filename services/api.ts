// services/api.ts
import { createApiService } from '~/utils/apiServiceFactory'
import { useFetch } from '~/utils/api'
import type { Lawyer } from '~/types/lawyer'
import type { PracticeArea, PracticeAreaCategory } from '~/composables/useLawyerAreas'
import type { User } from '~/composables/useAuth'

// Define input/output types for each service
interface LawyerCreate {
  name: string
  email: string
  title?: string
  bio?: string
  phone?: string
  city?: string
  image_url?: string
  languages?: string[]
  catchphrase?: string
  professional_start_date?: string
  user_id?: string
  areas?: { area_id: string; experience_score?: number }[]
}

interface LawyerUpdate {
  name?: string
  title?: string
  bio?: string
  phone?: string
  email?: string
  city?: string
  image_url?: string
  languages?: string[]
  catchphrase?: string
  professional_start_date?: string
  areas?: { area_id: string; experience_score?: number }[]
}

interface LawyerListResponse {
  lawyers: Lawyer[]
  total: number
  page: number
  size: number
  pages: number
}

interface PracticeAreaCreate {
  name: string
  slug: string
  category_id: string
  description?: string
}

interface PracticeAreaUpdate {
  name?: string
  slug?: string
  category_id?: string
  description?: string
}

interface PracticeAreaCategoryCreate {
  name: string
  slug: string
}

interface PracticeAreaCategoryUpdate {
  name?: string
  slug?: string
}

// Function to create the lawyers service
export const useLawyersService = () => {
  const api = useFetch()
  const baseService = createApiService<Lawyer, LawyerCreate, LawyerUpdate>('/lawyers')
  
  return {
    ...baseService,
    
    // Override list method to handle the specific response format
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
      
      return await api.get(`/lawyers${queryString}`) as LawyerListResponse
    },
    
    // Custom method for search
    search: async (params: {
      area?: string
      city?: string
      q?: string
      sort?: string
      page?: number
      size?: number
    }) => {
      const searchParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
      
      return await api.get(`/lawyers?${searchParams.toString()}`) as LawyerListResponse
    }
  }
}

// Function to create the areas service
export const useAreasService = () => {
  const api = useFetch()
  const baseService = createApiService<PracticeArea, PracticeAreaCreate, PracticeAreaUpdate>('/areas')
  
  return {
    ...baseService,
    
    // Get areas by category
    getByCategory: async (categoryId: string) => {
      return await api.get(`/categories/${categoryId}/areas`) as PracticeArea[]
    },
    
    // Get areas by category slug
    getByCategorySlug: async (slug: string) => {
      return await api.get(`/categories/slug/${slug}/areas`) as PracticeArea[]
    },
    
    // Get area by slug
    getBySlug: async (slug: string) => {
      return await api.get(`/areas/slug/${slug}`) as PracticeArea
    },
    
    // Get areas grouped by category
    getGroupedByCategory: async () => {
      return await api.get('/areas/by-category') as {
        id: string
        name: string
        slug: string
        areas: PracticeArea[]
      }[]
    }
  }
}

// Function to create the categories service
export const useCategoriesService = () => {
  const baseService = createApiService<
    PracticeAreaCategory,
    PracticeAreaCategoryCreate,
    PracticeAreaCategoryUpdate
  >('/categories')
  
  const api = useFetch()
  
  return {
    ...baseService,
    
    // Get category by slug
    getBySlug: async (slug: string) => {
      return await api.get(`/categories/slug/${slug}`) as PracticeAreaCategory
    }
  }
}

// Function to create the auth service
export const useAuthService = () => {
  const api = useFetch()
  
  return {
    // Login
    login: async (email: string, password: string) => {
      return await api.post('/auth/login', { email, password })
    },
    
    // Signup
    signup: async (email: string, password: string, first_name: string, last_name: string) => {
      return await api.post('/auth/signup', {
        email,
        password,
        first_name,
        last_name
      })
    },
    
    // Get current user
    getCurrentUser: async () => {
      return await api.get('/auth/me') as User
    },
    
    // Refresh token
    refreshToken: async (refresh_token: string) => {
      return await api.post('/auth/refresh', { refresh_token })
    },
    
    // Logout
    logout: async (refresh_token: string) => {
      return await api.post('/auth/logout', { refresh_token })
    }
  }
}