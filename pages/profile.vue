<!-- pages/profile.vue -->
<script>
// Add route meta data for middleware
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true
})
</script>
<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-3xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
      
      <!-- Loading state -->
      <div v-if="authLoading" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">Cargando información de perfil...</p>
      </div>
      
      <!-- Not authenticated state -->
      <div v-else-if="!isAuthenticated" class="bg-white rounded-lg shadow p-8 text-center">
        <p class="text-gray-600 mb-4">Debes iniciar sesión para ver tu perfil</p>
        <button 
          @click="showAuthModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          Iniciar Sesión
        </button>
        
        <AuthModal 
          :show="showAuthModal" 
          @close="showAuthModal = false" 
          @login="handleLogin" 
        />
      </div>
      
      <!-- Profile content -->
      <div v-else-if="user" class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Header with user avatar -->
        <div class="bg-primary-700 text-white p-6">
          <div class="flex items-center">
            <div class="w-16 h-16 rounded-full bg-white text-primary-700 flex items-center justify-center text-2xl font-bold mr-4">
              {{ userInitials }}
            </div>
            <div>
              <h2 class="text-xl font-semibold">
                {{ user.firstName }} {{ user.lastName }}
              </h2>
              <p class="text-primary-100">{{ user.email }}</p>
            </div>
          </div>
        </div>
        
        <!-- Profile details -->
        <div class="p-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Cuenta</h3>
            <div class="bg-gray-50 rounded-lg p-4 grid gap-4 md:grid-cols-2">
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium">{{ user.email }}</p>
              </div>
              <!-- Removed "Active" status -->
              <div>
                <p class="text-sm text-gray-500">Nombre</p>
                <p class="font-medium">{{ user.firstName || 'No especificado' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Apellido</p>
                <p class="font-medium">{{ user.lastName || 'No especificado' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Verificación</p>
                <p class="font-medium flex items-center">
                  <span v-if="user.is_verified" class="text-primary-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                  <span v-else class="text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    Pendiente
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end">
            <button 
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              @click="logout"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import AuthModal from '~/components/auth/Modal.vue'

const { user, isAuthenticated, authLoading, logout } = useAuth()
const showAuthModal = ref(false)

// User initials for avatar
const userInitials = computed(() => {
  if (!user.value) return '?'
  
  const firstName = user.value.firstName || ''
  const lastName = user.value.last_name || ''
  
  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()
  
  return firstInitial + (lastInitial || '')
})

// Handle login success
const handleLogin = (data) => {
  console.log('Login successful:', data)
  showAuthModal.value = false
}
</script>