<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <NuxtPage />
    
    <!-- Toast notification for auth events -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 bg-white rounded-lg shadow-lg p-4 border-l-4"
      :class="toastType === 'success' ? 'border-primary-500' : 'border-red-500'"
    >
      <div class="flex items-center">
        <div v-if="toastType === 'success'" class="text-primary-500 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div v-else class="text-red-500 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p class="font-medium">{{ toastMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { isAuthenticated, user, authError, loginAction, logoutAction } = useAuth()

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Create a computed property for user display name
const userDisplayName = computed(() => {
  if (!user.value) return 'Usuario'
  return user.value.firstName || 'Usuario'
})

// Watch for explicit login/logout actions
watch(loginAction, (hasLoggedIn) => {
  if (hasLoggedIn && user.value) {
    // Only show toast when the user has actually logged in
    toastType.value = 'success'
    toastMessage.value = `Bienvenido, ${userDisplayName.value}`
    showToast.value = true
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
})

// Watch for explicit logout actions
watch(logoutAction, (hasLoggedOut) => {
  if (hasLoggedOut) {
    toastType.value = 'success'
    toastMessage.value = 'Has cerrado sesión correctamente'
    showToast.value = true
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
})

// Show toast notification when auth error occurs
watch(authError, (newError) => {
  if (newError) {
    toastType.value = 'error'
    toastMessage.value = newError
    showToast.value = true
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
})
</script>