// composables/useLawyerProfile.ts
import { ref } from 'vue'
import type { Lawyer, PracticeArea } from '~/types/lawyer'
import { useLawyersService } from '~/services/api'

export const useLawyerProfile = () => {
  const lawyersService = useLawyersService()
  const profile = ref<Lawyer | null>(null)
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
      languages: apiLawyer.languages || [],
      education: apiLawyer.education ? apiLawyer.education : undefined
    }
  }

  const fetchProfile = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await lawyersService.get(id)
      profile.value = formatLawyer(response)
      return profile.value
    } catch (e) {
      console.error(`Error fetching lawyer with ID ${id}:`, e)
      error.value = e instanceof Error ? e.message : 'Error al cargar el perfil del abogado'
      profile.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    profile,
    isLoading,
    error,
    fetchProfile
  }
}