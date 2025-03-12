import { createApiService } from '~/utils/apiServiceFactory'
import { useFetch } from '~/utils/api'
import type { Lawyer } from '~/types/lawyer'
import type { PracticeArea, PracticeAreaCategory } from '~/composables/useLawyerAreas'
import type { User } from '~/composables/useAuth'
import type { City } from '~/types/city'
import type { Question, Answer, Reply } from '~/types/question'
import type { LegalTopic } from '~/types/legalTopics'
import { mapApiResponseToModel, mapModelToApiRequest } from '~/utils/caseConverters'

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

// Question-related interfaces
interface QuestionCreate {
  title: string
  content: string
  location?: string
  plan_to_hire: 'yes' | 'no' | 'maybe'
  topic_ids: string[]
}

interface QuestionUpdate {
  title?: string
  content?: string
  location?: string
  plan_to_hire?: 'yes' | 'no' | 'maybe'
  topic_ids?: string[]
}

interface QuestionsListResponse {
  questions: Question[]
  total: number
  page: number
  size: number
  pages: number
}

// Answer interfaces
interface AnswerCreate {
  content: string
  lawyer_id?: string
}

interface AnswerUpdate {
  content?: string
}

interface AnswerHelpfulResponse {
  success: boolean
  is_helpful: boolean
  helpfulCount: number
}

// Reply interfaces
interface ReplyCreate {
  content: string
}

// Cities service
export const useCitiesService = () => {
  const api = useFetch()
  const baseService = createApiService<City>('/cities')
  
  return {
    ...baseService,
    
    // Override list to handle case conversion
    list: async (params?: Record<string, any>) => {
      const response = await baseService.list(params) as City[]
      return response.map(city => mapApiResponseToModel<City>(city))
    },
    
    // Override get to handle case conversion
    get: async (id: string) => {
      const response = await baseService.get(id)
      return mapApiResponseToModel<City>(response)
    }
  }
}

// Topics service
export const useTopicsService = () => {
  const api = useFetch()
  const baseService = createApiService<LegalTopic>('/topics')

  return {
    ...baseService,
    
    // Override list to handle case conversion
    list: async (params?: Record<string, any>) => {
      const response = await baseService.list(params) as LegalTopic[]
      return response.map(topic => mapApiResponseToModel<LegalTopic>(topic))
    },
    
    // Override get to handle case conversion
    get: async (id: string) => {
      const response = await baseService.get(id)
      return mapApiResponseToModel<LegalTopic>(response)
    },

    // Get topic by slug
    getBySlug: async (slug: string) => {
      const response = await api.get(`/topics/slug/${slug}`)
      return mapApiResponseToModel<LegalTopic>(response)
    }
  }
}

// Questions service
export const useQuestionsService = () => {
  const api = useFetch()
  const baseService = createApiService<Question, QuestionCreate, QuestionUpdate>('/questions')

  return {
    ...baseService,
    
    // Override create to handle case conversion
    create: async (data: any) => {
      const apiData = mapModelToApiRequest(data)
      const response = await baseService.create(apiData)
      return mapApiResponseToModel<Question>(response)
    },
    
    // Override update to handle case conversion
    update: async (id: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      const response = await baseService.update(id, apiData)
      return mapApiResponseToModel<Question>(response)
    },

    // List questions with filters
    listQuestions: async (params?: {
      topic?: string
      page?: number
      size?: number
      sort?: string
    }) => {
      const searchParams = new URLSearchParams()

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await api.get(`/questions?${searchParams.toString()}`) as QuestionsListResponse
      return {
        ...response,
        questions: response.questions.map(q => mapApiResponseToModel<Question>(q))
      }
    }
  }
}

// Answers service
export const useAnswersService = () => {
  const api = useFetch()

  return {
    // Get answers for a question
    getForQuestion: async (questionId: string) => {
      const response = await api.get(`/questions/${questionId}/answers`) as Answer[]
      return response.map(answer => mapApiResponseToModel<Answer>(answer))
    },

    // Create an answer
    create: async (questionId: string, data: AnswerCreate) => {
      const apiData = mapModelToApiRequest(data)
      const response = await api.post(`/questions/${questionId}/answers`, apiData)
      return mapApiResponseToModel<Answer>(response)
    },

    // Update an answer
    update: async (answerId: string, data: AnswerUpdate) => {
      const apiData = mapModelToApiRequest(data)
      const response = await api.patch(`/answers/${answerId}`, apiData)
      return mapApiResponseToModel<Answer>(response)
    },

    // Delete an answer
    delete: async (answerId: string) => {
      return await api.delete(`/answers/${answerId}`)
    },

    // Accept an answer
    accept: async (answerId: string) => {
      const response = await api.post(`/answers/${answerId}/accept`, {})
      return mapApiResponseToModel<Answer>(response)
    },

    // Toggle helpful
    toggleHelpful: async (answerId: string) => {
      const response = await api.post(`/answers/${answerId}/helpful`, {}) as any
      // Handle both snake_case and camelCase response formats
      return {
        success: response.success,
        isHelpful: response.is_helpful !== undefined ? response.is_helpful : response.isHelpful,
        helpfulCount: response.helpful_count !== undefined ? response.helpful_count : response.helpfulCount
      }
    }
  }
}

// Replies service
export const useRepliesService = () => {
  const api = useFetch()

  return {
    // Get replies for an answer
    getForAnswer: async (answerId: string) => {
      const response = await api.get(`/answers/${answerId}/replies`) as Reply[]
      return response.map(reply => mapApiResponseToModel<Reply>(reply))
    },

    // Create a reply
    create: async (answerId: string, data: ReplyCreate) => {
      const apiData = mapModelToApiRequest(data)
      const response = await api.post(`/answers/${answerId}/replies`, apiData)
      return mapApiResponseToModel<Reply>(response)
    },

    // Delete a reply
    delete: async (replyId: string) => {
      return await api.delete(`/replies/${replyId}`)
    }
  }
}

// Function to create the lawyers service
export const useLawyersService = () => {
  const api = useFetch()
  const baseService = createApiService<Lawyer, LawyerCreate, LawyerUpdate>('/lawyers')

  return {
    ...baseService,
    
    // Override get to handle case conversion
    get: async (id: string) => {
      const response = await baseService.get(id)
      return mapApiResponseToModel<Lawyer>(response)
    },
    
    // Override create to handle case conversion
    create: async (data: any) => {
      const apiData = mapModelToApiRequest(data)
      const response = await baseService.create(apiData)
      return mapApiResponseToModel<Lawyer>(response)
    },
    
    // Override update to handle case conversion
    update: async (id: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      const response = await baseService.update(id, apiData)
      return mapApiResponseToModel<Lawyer>(response)
    },

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

      const response = await api.get(`/lawyers${queryString}`) as LawyerListResponse
      return {
        ...response,
        lawyers: response.lawyers.map(lawyer => mapApiResponseToModel<Lawyer>(lawyer))
      }
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

      const response = await api.get(`/lawyers?${searchParams.toString()}`) as LawyerListResponse
      return {
        ...response,
        lawyers: response.lawyers.map(lawyer => mapApiResponseToModel<Lawyer>(lawyer))
      }
    }
  }
}

// Function to create the areas service
export const useAreasService = () => {
  const api = useFetch()
  const baseService = createApiService<PracticeArea, PracticeAreaCreate, PracticeAreaUpdate>(
    '/areas'
  )

  return {
    ...baseService,
    
    // Override list to handle case conversion
    list: async (params?: Record<string, any>) => {
      const response = await baseService.list(params) as PracticeArea[]
      return response.map(area => mapApiResponseToModel<PracticeArea>(area))
    },
    
    // Override get to handle case conversion
    get: async (id: string) => {
      const response = await baseService.get(id)
      return mapApiResponseToModel<PracticeArea>(response)
    },

    // Get areas with lawyer counts
    getWithCounts: async () => {
      const response = await api.get('/areas/with-counts') as PracticeArea[]
      return response.map(area => {
        // Convert snake_case to camelCase, including lawyer_count -> lawyerCount
        const modelArea = mapApiResponseToModel<PracticeArea>(area)
        
        // Handle the potential naming differences
        if ('lawyer_count' in area) {
          modelArea.lawyerCount = area.lawyer_count as number
        }
        
        return modelArea
      })
    },

    // Get areas by category
    getByCategory: async (categoryId: string) => {
      const response = await api.get(`/categories/${categoryId}/areas`) as PracticeArea[]
      return response.map(area => mapApiResponseToModel<PracticeArea>(area))
    },

    // Get areas by category slug
    getByCategorySlug: async (slug: string) => {
      const response = await api.get(`/categories/slug/${slug}/areas`) as PracticeArea[]
      return response.map(area => mapApiResponseToModel<PracticeArea>(area))
    },

    // Get area by slug
    getBySlug: async (slug: string) => {
      const response = await api.get(`/areas/slug/${slug}`)
      return mapApiResponseToModel<PracticeArea>(response)
    },

    // Get areas grouped by category - FIXED to preserve original structure
    getGroupedByCategory: async () => {
      // Get the original response without automatic conversion
      const response = await api.get('/areas/by-category') as {
        id: string
        name: string
        slug: string
        areas: PracticeArea[]
      }[]
      
      // Return the unmodified response to preserve the grouping structure
      // Let the components handle the property access
      return response
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
    
    // Override list to handle case conversion
    list: async (params?: Record<string, any>) => {
      const response = await baseService.list(params) as PracticeAreaCategory[]
      return response.map(category => mapApiResponseToModel<PracticeAreaCategory>(category))
    },
    
    // Override get to handle case conversion
    get: async (id: string) => {
      const response = await baseService.get(id)
      return mapApiResponseToModel<PracticeAreaCategory>(response)
    },

    // Get category by slug
    getBySlug: async (slug: string) => {
      const response = await api.get(`/categories/slug/${slug}`)
      return mapApiResponseToModel<PracticeAreaCategory>(response)
    }
  }
}

// Function to create the auth service
export const useAuthService = () => {
  const api = useFetch()

  return {
    // Login
    login: async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password })
      return mapApiResponseToModel(response)
    },

    // Signup
    signup: async (email: string, password: string, first_name: string, last_name: string) => {
      // Auth endpoints expect snake_case parameters
      const response = await api.post('/auth/signup', {
        email,
        password,
        first_name,
        last_name
      })
      return mapApiResponseToModel(response)
    },

    // Get current user
    getCurrentUser: async () => {
      const response = await api.get('/auth/me')
      return mapApiResponseToModel<User>(response)
    },

    // Refresh token
    refreshToken: async (refresh_token: string) => {
      // Keep refresh_token in snake_case as expected by the API
      const response = await api.post('/auth/refresh', { refresh_token })
      return mapApiResponseToModel(response)
    },

    // Logout
    logout: async (refresh_token: string) => {
      // Keep refresh_token in snake_case as expected by the API
      return await api.post('/auth/logout', { refresh_token })
    }
  }
}

export const useReviewsService = () => {
  const api = useFetch()
  
  return {
    // Get reviews for a lawyer
    getForLawyer: async (lawyerId: string) => {
      const response = await api.get(`/lawyers/${lawyerId}/reviews`)
      return {
        reviews: response.reviews.map((review: any) => mapApiResponseToModel(review)),
        stats: mapApiResponseToModel(response.stats)
      }
    },
    
    // Create a review
    create: async (lawyerId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.post(`/lawyers/${lawyerId}/reviews`, apiData))
    },
    
    // Update a review
    update: async (lawyerId: string, reviewId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.patch(`/lawyers/${lawyerId}/reviews/${reviewId}`, apiData))
    },
    
    // Delete a review
    delete: async (lawyerId: string, reviewId: string) => {
      return await api.delete(`/lawyers/${lawyerId}/reviews/${reviewId}`)
    }
  }
}

// For experience
export const useExperienceService = () => {
  const api = useFetch()
  
  return {
    // Get experience for a lawyer
    getForLawyer: async (lawyerId: string) => {
      return mapApiResponseToModel(await api.get(`/lawyers/${lawyerId}/experience`))
    },
    
    // Education methods
    addEducation: async (lawyerId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.post(`/lawyers/${lawyerId}/education`, apiData))
    },
    
    updateEducation: async (lawyerId: string, educationId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await mapApiResponseToModel(api.patch(`/lawyers/${lawyerId}/education/${educationId}`, apiData)))
    },
    
    deleteEducation: async (lawyerId: string, educationId: string) => {
      return await api.delete(`/lawyers/${lawyerId}/education/${educationId}`)
    },
    
    // Work experience methods
    addWorkExperience: async (lawyerId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.post(`/lawyers/${lawyerId}/work-experience`, apiData))
    },
    
    updateWorkExperience: async (lawyerId: string, experienceId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.patch(`/lawyers/${lawyerId}/work-experience/${experienceId}`, apiData))
    },
    
    deleteWorkExperience: async (lawyerId: string, experienceId: string) => {
      return await api.delete(`/lawyers/${lawyerId}/work-experience/${experienceId}`)
    },
    
    // Achievement methods
    addAchievement: async (lawyerId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.post(`/lawyers/${lawyerId}/achievements`, apiData))
    },
    
    updateAchievement: async (lawyerId: string, achievementId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.patch(`/lawyers/${lawyerId}/achievements/${achievementId}`, apiData))
    },
    
    deleteAchievement: async (lawyerId: string, achievementId: string) => {
      return await api.delete(`/lawyers/${lawyerId}/achievements/${achievementId}`)
    }
  }
}

// For messaging
export const useMessagingService = () => {
  const api = useFetch()
  
  return {
    // Send a message to a lawyer
    send: async (lawyerId: string, data: any) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.post(`/lawyers/${lawyerId}/messages`, apiData))
    }
  }
}

// For analytics
export const useAnalyticsService = () => {
  const api = useFetch()
  
  return {
    // Track a call to a lawyer
    trackCall: async (lawyerId: string, data: { completed: boolean, timestamp: string }) => {
      const apiData = mapModelToApiRequest(data)
      return mapApiResponseToModel(await api.post(`/analytics/lawyers/${lawyerId}/call`, apiData))
    },
    
    // Track a profile view
    trackProfileView: async (lawyerId: string, source: string) => {
      //  We should call the API here once is created
      // return await api.post(`/analytics/profile-views`, {
      //   lawyer_id: lawyerId,
      //   source,
      //   timestamp: new Date().toISOString()
      // })
    },
    
    // Track a message event
    trackMessageEvent: async (lawyerId: string, status: string) => {
      //  We should call the API here once is created
      // return await api.post(`/analytics/message-events`, {
      //   lawyer_id: lawyerId,
      //   status,
      //   timestamp: new Date().toISOString()
      // })
    }
  }
}
