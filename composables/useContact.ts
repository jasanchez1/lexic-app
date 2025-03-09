// composables/useContact.ts
import { ref } from 'vue'
import { useFetch } from '~/utils/api'
import type { Lawyer } from '~/types/lawyer'

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
      // Note: Assuming there will be a messages endpoint in the future
      // For now, we'll just log the message
      console.log('Sending message to:', lawyer.name, messageForm.value)
      
      // When the API endpoint becomes available, uncomment the next line
      // await api.post(`/lawyers/${lawyer.id}/messages`, messageForm.value)
      
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