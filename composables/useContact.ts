import type { Lawyer } from '~/types/lawyer'
import { ref } from 'vue'

export const useContact = () => {
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
    // API call to send message would go here
    console.log('Sending message to:', lawyer.name, messageForm.value)
    resetForm()
  }

  const initiateCall = (phone: string) => {
    // eslint-disable-next-line no-undef
    window.location.href = `tel:${phone}`
  }

  return {
    messageForm,
    sendMessage,
    initiateCall,
    resetForm
  }
}
