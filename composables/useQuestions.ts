import { ref } from 'vue'
import { useQuestionsService } from '~/services/api'
import type { Question } from '~/types/question'

export const useQuestions = () => {
  const questionsService = useQuestionsService()
  const questions = ref<Question[]>([])
  const totalQuestions = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchQuestions = async (topicId?: string, page: number = 1, sort: string = 'latest') => {
    isLoading.value = true
    error.value = null

    try {
      const response = await questionsService.listQuestions({
        topic: topicId,
        page,
        size: 10,
        sort
      })
      
      questions.value = response.questions
      totalQuestions.value = response.total
      totalPages.value = response.pages
      currentPage.value = response.page
      
      return questions.value
    } catch (e) {
      console.error('Error fetching questions:', e)
      error.value = e instanceof Error ? e.message : 'Error al cargar las preguntas'
      questions.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  const fetchQuestion = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const question = await questionsService.get(id)
      return question
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar la pregunta'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createQuestion = async (data: {
    title: string
    content: string
    location?: string
    plan_to_hire: 'yes' | 'no' | 'maybe'
    topic_ids: string[]
  }) => {
    isLoading.value = true
    error.value = null
    
    try {
      const question = await questionsService.create(data)
      return { success: true, question }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al crear la pregunta'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    questions,
    totalQuestions,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchQuestions,
    fetchQuestion,
    createQuestion
  }
}