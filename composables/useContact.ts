import { ref } from 'vue'
import { useFetch } from '~/utils/api'
import type { Lawyer } from '~/types/lawyer'
import { useMessagingService } from '~/services/api'

export const useContact = () => {
  const api = useFetch()
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
      // Use the actual API endpoint
      await useMessagingService().send(lawyer.id, {
        name: messageForm.value.name,
        email: messageForm.value.email,
        phone: messageForm.value.phone,
        message: messageForm.value.message
      })

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
