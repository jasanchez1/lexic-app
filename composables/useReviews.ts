import { ref } from 'vue'
import { useFetch } from '~/utils/api'
import type { LawyerReview, ReviewStats } from '~/types/review'

export const useReviews = () => {
  const api = useFetch()
  const reviews = ref<LawyerReview[]>([])
  const stats = ref<ReviewStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchReviews = async (lawyerId: string) => {
    isLoading.value = true
    error.value = null

    try {
      // Use the actual API endpoint
      const response = await api.get(`/lawyers/${lawyerId}/reviews`)
      
      reviews.value = response.reviews || []
      stats.value = response.stats || null
      
      return { reviews: reviews.value, stats: stats.value }
    } catch (e) {
      console.error('Error fetching reviews:', e)
      error.value = e instanceof Error ? e.message : 'Error al cargar las reseñas'
      reviews.value = []
      stats.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  const submitReview = async (lawyerId: string, reviewData: any) => {
    try {
      // Use the actual API endpoint
      const response = await api.post(`/lawyers/${lawyerId}/reviews`, reviewData)
      
      // Refresh reviews after submission
      await fetchReviews(lawyerId)
      
      return { success: true, reviewId: response.review_id }
    } catch (error) {
      console.error('Error submitting review:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al enviar la reseña' 
      }
    }
  }

  return {
    reviews,
    stats,
    isLoading,
    error,
    fetchReviews,
    submitReview
  }
}