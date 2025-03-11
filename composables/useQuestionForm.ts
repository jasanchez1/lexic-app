import { ref } from 'vue'
import { useQuestionsService } from '~/services/api'

interface QuestionForm {
  title: string
  content: string
  location: string
  planToHire: 'yes' | 'maybe' | 'no' | null
  topicIds: string[]
  cityId?: string  // Added to store the selected city ID
}

// Keep state outside the composable
const formData = ref<QuestionForm>({
  title: '',
  content: '',
  location: '',
  planToHire: null,
  topicIds: []
})

const currentStep = ref<'ask' | 'review'>('ask')

export const useQuestionForm = () => {
  const questionsService = useQuestionsService()
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)
  const isDirty = ref(false)
  const wasSubmitted = ref(false)

  const resetForm = () => {
    formData.value = {
      title: '',
      content: '',
      location: '',
      planToHire: null,
      topicIds: []
    }
    currentStep.value = 'ask'
    isDirty.value = false
    wasSubmitted.value = false
    error.value = null
  }

  const moveToReview = () => {
    currentStep.value = 'review'
    isDirty.value = true
  }

  const moveToEdit = () => {
    currentStep.value = 'ask'
  }

  const markAsDirty = () => {
    isDirty.value = true
  }

  const submitQuestion = async () => {
    if (!formData.value.title || !formData.value.content || !formData.value.planToHire || !formData.value.topicIds.length) {
      return { success: false, error: 'Información incompleta' }
    }

    isSubmitting.value = true
    error.value = null
    
    try {
      // Use the updated service with case conversion
      const response = await questionsService.create({
        title: formData.value.title,
        content: formData.value.content,
        location: formData.value.location || undefined,
        planToHire: formData.value.planToHire,
        topicIds: formData.value.topicIds,
        cityId: formData.value.cityId // Pass the city ID if available
      })
      
      wasSubmitted.value = true
      isDirty.value = false
      
      return { success: true, question: response }
    } catch (e) {
      console.error('Error submitting question:', e)
      error.value = e instanceof Error ? e.message : 'Error al enviar la pregunta'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formData,
    currentStep,
    isSubmitting,
    error,
    isDirty,
    wasSubmitted,
    moveToReview,
    moveToEdit,
    submitQuestion,
    resetForm,
    markAsDirty
  }
}