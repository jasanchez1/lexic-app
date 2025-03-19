import { useAnswersService } from '~/services/api'

export const useAnswerActions = () => {
  const answersService = useAnswersService()

  const toggleHelpful = async (answerId: string) => {
    try {
      const response = await answersService.toggleHelpful(answerId)
      return {
        success: response.success,
        isHelpful: response.is_helpful,
        helpfulCount: response.helpfulCount
      }
    } catch (e) {
      console.error('Error toggling helpful:', e)
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Error al marcar como útil'
      }
    }
  }

  return {
    toggleHelpful
  }
}
