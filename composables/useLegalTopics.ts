import { ref } from 'vue'
import { useTopicsService } from '~/services/api'
import type { LegalTopic } from '~/types/legalTopics'

export const useLegalTopics = () => {
  const topicsService = useTopicsService()
  const topics = ref<LegalTopic[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTopics = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Replace the mocked delay and assignment with actual API call
      const response = await topicsService.list()
      topics.value = response
    } catch (e) {
      console.error('Error fetching topics:', e)
      error.value = e instanceof Error ? e.message : 'Error al cargar los temas legales'
    } finally {
      isLoading.value = false
    }
  }

  const fetchTopicBySlug = async (slug: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      return await topicsService.getBySlug(slug)
    } catch (e) {
      console.error(`Error fetching topic with slug ${slug}:`, e)
      error.value = e instanceof Error ? e.message : 'Error al cargar el tema legal'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    topics,
    isLoading,
    error,
    fetchTopics,
    fetchTopicBySlug
  }
}