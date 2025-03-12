import { ref } from 'vue'
import { useFetch } from '~/utils/api'
import type { Education, WorkExperience, Achievement, LawyerStats } from '~/types/experience'
import { useExperienceService } from '~/services/api'

export const useLawyerExperience = () => {
  const api = useFetch()
  const education = ref<Education[]>([])
  const workExperience = ref<WorkExperience[]>([])
  const achievements = ref<Achievement[]>([])
  const stats = ref<LawyerStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchExperience = async (lawyerId: string) => {
    isLoading.value = true
    error.value = null

    try {
      // Use the actual API endpoint
      const response = await useExperienceService().getForLawyer(lawyerId)

      // Map the response to our data structure
      education.value = response.education || []
      workExperience.value = response.workExperience || []
      achievements.value = response.achievements || []
      stats.value = response.stats || null
      
      return {
        education: education.value,
        workExperience: workExperience.value,
        achievements: achievements.value,
        stats: stats.value
      }
    } catch (e) {
      console.error(`Error fetching experience for lawyer ${lawyerId}:`, e)
      error.value = e instanceof Error ? e.message : 'Error al cargar la experiencia'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    education,
    workExperience,
    achievements,
    stats,
    isLoading,
    error,
    fetchExperience
  }
}