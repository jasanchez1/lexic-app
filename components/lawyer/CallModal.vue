<script setup lang="ts">
import { useContact } from '~/composables/useContact'
import { useAnalytics } from '~/composables/useAnalytics'
import type { Lawyer } from '~/types/lawyer'

const props = defineProps<{
  lawyer: Lawyer
  show: boolean
}>()

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'close'): void
}>()

const { initiateCall } = useContact()
const { trackCallEvent } = useAnalytics()

const handleCall = () => {
  // First track the call - this is now synchronous
  trackCallEvent(props.lawyer, true)
  
  // Then initiate the call
  initiateCall(props.lawyer.phone)
  
  // Close the modal
  emit('close')
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Llamar a {{ lawyer.name }}</h3>
      <p class="text-gray-600 mb-4">{{ lawyer.phone }}</p>
      <div class="flex gap-3">
        <button
          class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          @click="handleCall"
        >
          Llamar
        </button>
        <button
          class="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          @click="emit('close')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
