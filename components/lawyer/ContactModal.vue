<script setup lang="ts">
import { ref, watch } from 'vue'
import { useContact } from '~/composables/useContact'
import { useAnalytics } from '~/composables/useAnalytics'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import type { Lawyer } from '~/types/lawyer'
import AuthModal from '~/components/auth/Modal.vue'
import { useMessagingService } from '~/services/api'

const props = defineProps<{
  lawyer: Lawyer
  show: boolean
}>()

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'close'): void
}>()

const router = useRouter()
const { messageForm, resetForm } = useContact()
const { trackMessageEvent } = useAnalytics()
const { isAuthenticated, user } = useAuth()
const messagingService = useMessagingService()

// Add state for auth modal
const showAuthModal = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Update the message form with user information when logged in
watch([user, props.show], ([newUser]) => {
  if (newUser && isAuthenticated.value) {
    // Auto-fill user information when logged in
    messageForm.name = newUser.firstName + ' ' + (newUser.lastName || '')
    messageForm.email = newUser.email
  }
}, { immediate: true })

const handleSend = async () => {
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    showAuthModal.value = true
    return
  }

  // Basic validation
  if (!messageForm.value?.message) {
    errorMessage.value = 'Por favor ingrese un mensaje'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // Send the message using the messaging service
    await messagingService.send(props.lawyer.id, {
      content: messageForm.value?.message.trim(),
      user_id: user.value?.id,
      name: user.value?.firstName + ' ' + (user.value?.lastName || ''),
      email: user.value?.email,
    })
    
    // Track the message event
    trackMessageEvent(props.lawyer, 'sent')
    
    // Show success message
    successMessage.value = 'Mensaje enviado correctamente'
    
    // Reset the form
    resetForm()
    
    // Close the modal after 2 seconds
    setTimeout(() => {
      emit('close')
      // Navigate to messages page
      router.push('/messages')
    }, 2000)
  } catch (error) {
    console.error('Error sending message:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error al enviar el mensaje'
  } finally {
    isSubmitting.value = false
  }
}

// Handle successful login
const handleLoginSuccess = () => {
  showAuthModal.value = false
  // Fill in user info if available
  if (user.value) {
    messageForm.name = user.value.firstName + ' ' + (user.value.lastName || '')
    messageForm.email = user.value.email
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-bold">Enviar mensaje a {{ lawyer.name }}</h3>
          <p class="text-sm text-gray-600">{{ lawyer.title }}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600" @click="emit('close')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Alert messages -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
        {{ successMessage }}
      </div>

      <div class="space-y-4">
        <!-- Authentication note for non-logged in users -->
        <div v-if="!isAuthenticated" class="bg-primary-50 p-3 rounded-md text-sm">
          Inicia sesión para enviar un mensaje a este abogado
        </div>

        <!-- Form fields - simplified for authenticated users -->
        <template v-if="isAuthenticated">
          <!-- Show user info as non-editable fields -->
          <div class="bg-gray-50 p-4 rounded-md mb-4">
            <div class="flex items-center mb-2">
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2">
                {{ user?.firstName?.charAt(0) || '' }}{{ user?.lastName?.charAt(0) || '' }}
              </div>
              <div>
                <p class="font-medium">{{ user?.firstName }} {{ user?.lastName }}</p>
                <p class="text-sm text-gray-500">{{ user?.email }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
              Mensaje *
            </label>
            <textarea
              id="message"
              v-model="messageForm.message"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>

          <div class="text-sm text-gray-600">
            <p>
              Al enviar un mensaje, iniciará una conversación con este abogado que podrá continuar en la 
              sección de mensajes de su perfil.
            </p>
          </div>
        </template>
      </div>

      <div class="flex gap-3 mt-6">
        <button
          class="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          @click="emit('close')"
        >
          Cancelar
        </button>

        <button
          class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!messageForm.message || isSubmitting || !isAuthenticated"
          @click="handleSend"
        >
          <span v-if="isSubmitting">
            <span 
              class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"
            ></span>
            Enviando...
          </span>
          <span v-else>Enviar mensaje</span>
        </button>
      </div>
    </div>
    
    <!-- Auth Modal -->
    <AuthModal 
      :show="showAuthModal" 
      @close="showAuthModal = false" 
      @login="handleLoginSuccess"
    />
  </div>
</template>