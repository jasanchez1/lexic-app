export const useAnswerActions = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleHelpful = async (answerId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 200))
      return { success: true }
    } catch (e) {
      console.error('Error toggling helpful:', e)
      return { success: false, error: 'Error al marcar como útil' }
    }
  }

  return {
    toggleHelpful
  }
}
