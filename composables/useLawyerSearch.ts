import { ref } from 'vue'
import type { Lawyer, PracticeArea } from '~/types/lawyer'
import { useLawyersService } from '~/services/api'


export const useLawyerSearch = () => {
  const lawyersService = useLawyersService()
  const lawyers = ref<Lawyer[]>([])
  const totalLawyers = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Format API response to match our frontend model
  const formatLawyer = (apiLawyer: any): Lawyer => {
    return {
      id: apiLawyer.id,
      name: apiLawyer.name,
      title: apiLawyer.title || '',
      email: apiLawyer.email,
      reviewScore: apiLawyer.review_score || 0,
      reviewCount: apiLawyer.review_count || 0,
      // Convert string date to Date object
      professionalStartDate: apiLawyer.professional_start_date 
        ? new Date(apiLawyer.professional_start_date) 
        : new Date(),
      // Map API areas format to our format
      areas: Array.isArray(apiLawyer.areas) 
        ? apiLawyer.areas.map((area: any): PracticeArea => ({
            id: area.id,
            name: area.name,
            slug: area.slug,
            experienceScore: area.experience_score || 50
          }))
        : [],
      bio: apiLawyer.bio || '',
      imageURL: apiLawyer.image_url || 'https://via.placeholder.com/150',
      phone: apiLawyer.phone || '',
      city: apiLawyer.city || 'Santiago',
      // Optional fields
      catchPhrase: apiLawyer.catchphrase,
      languages: apiLawyer.languages || []
    }
  }

  const searchLawyers = async (params: {
    area?: string
    city?: string
    q?: string
    sort?: string
    page?: number
    size?: number
  }) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Use the search method from the service
      const response = await lawyersService.search(params)
      
      lawyers.value = response.lawyers.map(formatLawyer)
      totalLawyers.value = response.total
      totalPages.value = response.pages
      currentPage.value = response.page
      pageSize.value = response.size
      
      return response
    } catch (e) {
      console.error('Error searching lawyers:', e)
      error.value = e instanceof Error ? e.message : 'Error al buscar abogados'
      lawyers.value = []
      return null
    } finally {
      isLoading.value = false
    }
  }

  const getLawyer = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await lawyersService.get(id)
      return formatLawyer(response)
    } catch (e) {
      console.error(`Error fetching lawyer with ID ${id}:`, e)
      error.value = e instanceof Error ? e.message : 'Error al cargar el perfil del abogado'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    lawyers,
    totalLawyers,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    searchLawyers,
    getLawyer
  }
}