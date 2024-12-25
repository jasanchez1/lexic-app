import { ref } from 'vue'
import type { LawyerReview, ReviewStats } from '~/types/review'

const mockReviews: LawyerReview[] = [
  {
    id: '1',
    rating: 5,
    title: 'Increible. Recomendado 100%',
    content:
      'Gabrielito ha sido mi asesor de confianza durante cuatro años, brindando asistencia invaluable en diversos asuntos durante mi litigio comercial exitoso. Su experiencia, dedicación y enfoque personalizado me hicieron sentir confiado y bien respaldado durante mi caso increíblemente complejo...',
    author: 'Ana M.',
    date: '2024-01-18',
    isHiredAttorney: true
  },
  {
    id: '2',
    rating: 5,
    title: 'El mejor abogado que pude encontrar',
    content:
      'Un abogado increíble, talentoso, atento e inteligente. Tuve un caso de litigio contra socios comerciales y fue el mejor abogado que pude encontrar. Tiene un gran conocimiento y experiencia en su campo...',
    author: 'Jose F.',
    date: '2023-12-03',
    isHiredAttorney: true
  },
  {
    id: '3',
    title: 'El unicornio de los abogados presidentes',
    rating: 5,
    content: 'Best presi ever.',
    author: 'Carlos R.',
    date: '2023-12-03',
    isHiredAttorney: false
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

export const useReviews = () => {
  const reviews = ref<LawyerReview[]>([])
  const stats = ref<ReviewStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchReviews = async (lawyerId: string) => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      reviews.value = mockReviews
      stats.value = mockStats
    } catch (e) {
      console.error(e)
      error.value = 'Error al cargar las reseñas'
    } finally {
      isLoading.value = false
    }
  }

  return {
    reviews,
    stats,
    isLoading,
    error,
    fetchReviews
  }
}
