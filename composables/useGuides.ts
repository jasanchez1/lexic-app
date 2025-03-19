import { ref } from 'vue'
import { useGuidesService } from '~/services/api'
import { useAnalytics } from '~/composables/useAnalytics'
import type { Guide, GuideDetail } from '~/services/api'

export const useGuides = () => {
  const guidesService = useGuidesService()
  const { trackGuideView } = useAnalytics()
  
  const guides = ref<Guide[]>([])
  const currentGuide = ref<GuideDetail | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalGuides = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  
  // Fetch all guides
  const fetchGuides = async (page: number = 1, limit: number = 10) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await guidesService.list({ page, limit })
      guides.value = response.guides
      totalGuides.value = response.total
      totalPages.value = response.pages
      currentPage.value = response.page
      return guides.value
    } catch (e) {
      console.error('Error fetching guides:', e)
      error.value = e instanceof Error ? e.message : 'Error loading guides'
      guides.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch guide by slug
  const fetchGuideBySlug = async (slug: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const guide = await guidesService.getBySlug(slug)
      currentGuide.value = guide
      
      // Track the guide view
      if (guide?.id) {
        trackGuideView(guide.id)
      }
      
      return guide
    } catch (e) {
      console.error(`Error fetching guide with slug ${slug}:`, e)
      error.value = e instanceof Error ? e.message : 'Error loading guide'
      currentGuide.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    guides,
    currentGuide,
    isLoading,
    error,
    totalGuides,
    totalPages,
    currentPage,
    fetchGuides,
    fetchGuideBySlug
  }
}