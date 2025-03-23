import { ref } from 'vue'
import { useFetch } from '~/utils/api'

export interface GuideCategory {
  id: string
  name: string
  slug: string
  description: string | null
  guide_count: number
  created_at: string
  updated_at: string
}

interface CategoryResponse {
  categories: GuideCategory[]
  total: number
  page: number
  pages: number
}

export const useGuideCategories = () => {
  const api = useFetch()
  const categories = ref<GuideCategory[]>([])
  const totalCategories = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const fetchCategories = async (page: number = 1) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/guides/categories?page=${page}`) as CategoryResponse
      
      // Extract categories from the nested response
      categories.value = response.categories || []
      totalCategories.value = response.total || 0
      totalPages.value = response.pages || 0
      currentPage.value = response.page || 1
      
      return categories.value
    } catch (e) {
      console.error('Error fetching guide categories:', e)
      error.value = e instanceof Error ? e.message : 'Error loading guide categories'
      categories.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    categories,
    totalCategories,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchCategories
  }
}