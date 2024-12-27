import { ref } from 'vue'
import type { Question } from '~/types/question'

const mockQuestions: Question[] = [
  {
    id: '1',
    title: '¿Puedo modificar el monto de pensión de alimentos?',
    content:
      'Hace dos años se fijó una pensión de alimentos para mis hijos, pero mi situación económica ha cambiado significativamente...',
    author: {
      name: 'Ana M.',
      location: 'Santiago, Chile'
    },
    date: '2024-01-24',
    topicIds: ['family', 'alimony'],
    answerCount: 3,
    viewCount: 124
  },
  {
    id: '2',
    title: '¿Cómo proceder ante un despido sin justificación?',
    content:
      'Mi empleador me despidió sin darme ninguna razón específica después de 5 años de trabajo...',
    author: {
      name: 'Carlos R.',
      location: 'Valparaíso, Chile'
    },
    date: '2024-01-23',
    topicIds: ['labor', 'wrongful-termination'],
    answerCount: 2,
    viewCount: 89
  },
  {
    id: '3',
    title: 'Problemas con contrato de arriendo',
    content:
      'Mi arrendador quiere terminar el contrato antes de tiempo sin respetar el plazo acordado...',
    author: {
      name: 'Pedro S.',
      location: 'Concepción, Chile'
    },
    date: '2024-01-22',
    topicIds: ['property', 'rental'],
    answerCount: 4,
    viewCount: 156
  }
]

export const useQuestions = () => {
  const questions = ref<Question[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchQuestions = async (topicId?: string) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 200))

      // If topicId is provided, filter questions
      questions.value = topicId
        ? mockQuestions.filter(q => q.topicIds.includes(topicId))
        : mockQuestions
    } catch (e) {
      console.error(e)
      error.value = 'Error al cargar las preguntas'
    } finally {
      isLoading.value = false
    }
  }

  const fetchQuestion = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      const question = mockQuestions.find(q => q.id === id)

      if (!question) {
        throw new Error('Pregunta no encontrada')
      }

      return question
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar la pregunta'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    questions,
    isLoading,
    error,
    fetchQuestions,
    fetchQuestion
  }
}
