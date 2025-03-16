import { ref } from 'vue'
import { useFetch } from '~/utils/api'
import type { Lawyer } from '~/types/lawyer'
import { useMessagingService } from '~/services/api'
import { useAuth } from '~/composables/useAuth'

export const useContact = () => {
  const api = useFetch()
  const { user } = useAuth() // Get current user info
  const messagingService = useMessagingService()
  
  const messageForm = ref({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const resetForm = () => {
    messageForm.value = {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  }

  const sendMessage = async (lawyer: Lawyer) => {
    try {
      // Add user_id to the message data if user is authenticated
      const messageData = {
        name: messageForm.value.name,
        email: messageForm.value.email,
        phone: messageForm.value.phone,
        message: messageForm.value.message,
        user_id: user.value?.id // Add user ID if available
      }
      
      await messagingService.send(lawyer.id, messageData)

      resetForm()
      return { success: true }
    } catch (error) {
      console.error('Error sending message:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al enviar el mensaje'
      }
    }
  }

  const initiateCall = (phone: string) => {
    // This is a client-side function to initiate a call
    if (process.client) {
      window.location.href = `tel:${phone}`
    }
  }

  return {
    messageForm,
    sendMessage,
    initiateCall,
    resetForm
  }
}