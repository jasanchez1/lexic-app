// composables/useReviews.ts
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
      // Note: Assuming there will be a reviews endpoint in the future
      // For now, we'll use mocked data
      // When the API endpoint becomes available, uncomment the next line
      // const response = await api.get(`/lawyers/${lawyerId}/reviews`)
      
      // Mock API response
      const mockReviews: LawyerReview[] = [
        {
          id: '1',
          rating: 5,
          title: 'Increible. Recomendado 100%',
          content:
            'Ha sido mi asesor de confianza durante cuatro años, brindando asistencia invaluable en diversos asuntos durante mi litigio comercial exitoso. Su experiencia, dedicación y enfoque personalizado me hicieron sentir confiado y bien respaldado durante mi caso increíblemente complejo...',
          author: 'Ana M.',
          date: '2024-01-18',
          isHired: true
        },
        {
          id: '2',
          rating: 5,
          title: 'El mejor abogado que pude encontrar',
          content:
            'Un abogado increíble, talentoso, atento e inteligente. Tuve un caso de litigio contra socios comerciales y fue el mejor abogado que pude encontrar. Tiene un gran conocimiento y experiencia en su campo...',
          author: 'Jose F.',
          date: '2023-12-03',
          isHired: true
        },
        {
          id: '3',
          title: 'Muy profesional',
          rating: 5,
          content: 'Excelente trato y resultados.',
          author: 'Carlos R.',
          date: '2023-12-03',
          isHired: false
        }
      ]

      const mockStats: ReviewStats = {
        average: 4.3,
        total: 6,
        distribution: {
          5: 83,
          4: 0,
          3: 0,
          2: 0,
          1: 17
        }
      }
      
      reviews.value = mockReviews
      stats.value = mockStats
      
      return { reviews: mockReviews, stats: mockStats }
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
      // Note: Assuming there will be a reviews endpoint in the future
      // For now, we'll just log the review data
      console.log('Submitting review for lawyer', lawyerId, reviewData)
      
      // When the API endpoint becomes available, uncomment the next line
      // await api.post(`/lawyers/${lawyerId}/reviews`, reviewData)
      
      // Refresh reviews after submission
      await fetchReviews(lawyerId)
      
      return { success: true }
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