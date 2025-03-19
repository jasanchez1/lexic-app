import { ref } from 'vue'
import { useAnswersService } from '~/services/api'
import type { Answer } from '~/types/question'


export const useAnswers = () => {
  const answersService = useAnswersService()
  const answers = ref<Answer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchAnswers = async (questionId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await answersService.getForQuestion(questionId)
      answers.value = response
      return answers.value
    } catch (e) {
      console.error('Error fetching answers:', e)
      error.value = e instanceof Error ? e.message : 'Error al cargar las respuestas'
      answers.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  const createAnswer = async (questionId: string, content: string, lawyerId?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await answersService.create(questionId, {
        content,
        lawyer_id: lawyerId
      })
      
      // Add the new answer to the list
      answers.value.push(response)
      return { success: true, answer: response }
    } catch (e) {
      console.error('Error creating answer:', e)
      error.value = e instanceof Error ? e.message : 'Error al crear la respuesta'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const acceptAnswer = async (answerId: string) => {
    try {
      const response = await answersService.accept(answerId)
      
      // Update the answer in the list
      const index = answers.value.findIndex(a => a.id === answerId)
      if (index !== -1) {
        answers.value[index] = response
      }
      
      return { success: true, answer: response }
    } catch (e) {
      console.error('Error accepting answer:', e)
      error.value = e instanceof Error ? e.message : 'Error al aceptar la respuesta'
      return { success: false, error: error.value }
    }
  }

  return {
    answers,
    isLoading,
    error,
    fetchAnswers,
    createAnswer,
    acceptAnswer
  }
}