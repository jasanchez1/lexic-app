import { ref } from 'vue'
import type { Answer } from '~/types/question'

const mockAnswers: Record<string, Answer[]> = {
  '1': [
    {
      id: 'a1',
      content: 'Sí, es posible modificar el monto de la pensión de alimentos cuando hay un cambio significativo en las circunstancias económicas. El proceso implica...',
      author: {
        id: 'l1',
        name: 'Gabriel Boric',
        title: 'Abogado de Familia',
        imageUrl: 'https://www.cidob.org/sites/default/files/styles/max_width_290/public/gabriel_boric_font.jpg.webp',
        rating: 4.8,
        reviewCount: 123,
        isVerified: true
      },
      date: '2024-01-24',
      isAccepted: true,
      upvotes: 15
    },
    {
      id: 'a2',
      content: 'Complementando la respuesta anterior, es importante mencionar que los tribunales consideran tanto sus ingresos como los gastos del menor...',
      author: {
        id: 'l2',
        name: 'Carolina Pérez',
        title: 'Abogada Civil',
        rating: 4.5,
        reviewCount: 89,
        isVerified: true
      },
      date: '2024-01-25',
      upvotes: 8
    }
  ]
  // Add more mock answers for other questions...
}

export const useAnswers = () => {
  const answers = ref<Answer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchAnswers = async (questionId: string) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      answers.value = mockAnswers[questionId] || []
    } catch (e) {
        console.error(e)
      error.value = 'Error al cargar las respuestas'
    } finally {
      isLoading.value = false
    }
  }

  return {
    answers,
    isLoading,
    error,
    fetchAnswers
  }
}