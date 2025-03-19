import { ref } from 'vue'
import { useRepliesService } from '~/services/api'
import type { Reply } from '~/types/question'

export const useReplies = () => {
  const repliesService = useRepliesService()
  const replies = ref<Reply[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchReplies = async (answerId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await repliesService.getForAnswer(answerId)
      replies.value = response
      return replies.value
    } catch (e) {
      console.error('Error fetching replies:', e)
      error.value = e instanceof Error ? e.message : 'Error al cargar las respuestas'
      replies.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  const createReply = async (answerId: string, content: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await repliesService.create(answerId, { content })
      
      // Add the new reply to the list
      replies.value.push(response)
      return { success: true, reply: response }
    } catch (e) {
      console.error('Error creating reply:', e)
      error.value = e instanceof Error ? e.message : 'Error al crear la respuesta'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteReply = async (replyId: string) => {
    try {
      await repliesService.delete(replyId)
      
      // Remove the reply from the list
      replies.value = replies.value.filter(r => r.id !== replyId)
      return { success: true }
    } catch (e) {
      console.error('Error deleting reply:', e)
      error.value = e instanceof Error ? e.message : 'Error al eliminar la respuesta'
      return { success: false, error: error.value }
    }
  }

  return {
    replies,
    isLoading,
    error,
    fetchReplies,
    createReply,
    deleteReply
  }
}