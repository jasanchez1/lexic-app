<script setup lang="ts">
import { ref, watch } from 'vue'
import { useContact } from '~/composables/useContact'
import { useAnalytics } from '~/composables/useAnalytics'
import { useAuth } from '~/composables/useAuth'
import type { Lawyer } from '~/types/lawyer'
import AuthModal from '~/components/auth/Modal.vue'

const props = defineProps<{
  lawyer: Lawyer
  show: boolean
}>()

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'close'): void
}>()

const { messageForm, sendMessage, resetForm } = useContact()
const { trackMessageEvent } = useAnalytics()
const { isAuthenticated, user } = useAuth()

// Add state for auth modal
const showAuthModal = ref(false)

// Update the message form with user information when logged in
watch(user, (newUser) => {
  if (newUser) {
    messageForm.name = newUser.firstName + ' ' + (newUser.lastName || '')
    messageForm.email = newUser.email
  }
})

const handleSend = async () => {
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    showAuthModal.value = true
    return
  }

  await sendMessage(props.lawyer)
  trackMessageEvent(props.lawyer, 'sent')
  resetForm()
  emit('close')
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

      <div class="space-y-4">
        <!-- Form fields -->
        <div
          v-for="field in [
            { id: 'name', label: 'Nombre', type: 'text', required: true },
            { id: 'email', label: 'Email', type: 'email', required: true },
            { id: 'phone', label: 'Teléfono', type: 'tel', required: false }
          ]"
          :key="field.id"
        >
          <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1">
            {{ field.label }} {{ field.required ? '*' : '(opcional)' }}
          </label>
          <input
            :id="field.id"
            v-model="messageForm[field.id as keyof typeof messageForm]"
            :type="field.type"
            :required="field.required"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
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
      </div>

      <div class="flex gap-3 mt-6">
        <button
          class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!messageForm.name || !messageForm.email || !messageForm.message"
          @click="handleSend"
        >
          Enviar mensaje
        </button>
        <button
          class="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          @click="emit('close')"
        >
          Cancelar
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