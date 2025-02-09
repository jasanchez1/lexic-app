import { ref } from 'vue'

interface QuestionForm {
  title: string
  content: string
  location: string
  planToHire: 'yes' | 'maybe' | 'no' | null
}

// Keep state outside the composable
const formData = ref<QuestionForm>({
  title: '',
  content: '',
  location: '',
  planToHire: null
})

const currentStep = ref<'ask' | 'review'>('ask')

export const useQuestionForm = () => {
  const moveToReview = () => {
    currentStep.value = 'review'
  }

  const moveToEdit = () => {
    currentStep.value = 'ask'
  }

  const submitQuestion = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Here you would submit to your API
      return { success: true }
    } catch (error) {
      console.error('Error submitting question:', error)
      return { success: false, error }
    }
  }

  return {
    formData,
    currentStep,
    moveToReview,
    moveToEdit,
    submitQuestion
  }
}
