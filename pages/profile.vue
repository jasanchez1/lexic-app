<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-3xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

      <!-- Loading state -->
      <div v-if="authLoading" class="bg-white rounded-lg shadow p-8 text-center">
        <div
          class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"
        ></div>
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

        <AuthModal :show="showAuthModal" @close="showAuthModal = false" @login="handleLogin" />
      </div>

      <!-- Profile content -->
      <div v-else-if="user" class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Header with user avatar and edit button -->
        <div class="bg-primary-700 text-white p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="w-16 h-16 rounded-full bg-white text-primary-700 flex items-center justify-center text-2xl font-bold mr-4"
              >
                {{ userInitials }}
              </div>
              <div>
                <h2 class="text-xl font-semibold">{{ user.firstName }} {{ user.lastName }}</h2>
                <p class="text-primary-100">{{ user.email }}</p>
              </div>
            </div>
            <button
              @click="toggleEditMode"
              class="bg-white text-primary-700 hover:bg-gray-100 px-3 py-2 rounded-md flex items-center font-medium"
            >
              <span v-if="!editMode" class="flex items-center">
                <PencilIcon class="w-4 h-4 mr-1" />
                <span>Editar Perfil</span>
              </span>
              <span v-else class="flex items-center">
                <XIcon class="w-4 h-4 mr-1" />
                <span>Cancelar</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Profile details -->
        <div class="p-6 space-y-6">
          <!-- View Mode -->
          <div v-if="!editMode">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Cuenta</h3>
            <div class="bg-gray-50 rounded-lg p-4 grid gap-4 md:grid-cols-2">
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium">{{ user.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Nombre</p>
                <p class="font-medium">{{ user.firstName || 'No especificado' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Apellido</p>
                <p class="font-medium">{{ user.lastName || 'No especificado' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Fecha de Registro</p>
                <p class="font-medium">
                  {{
                    new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <form v-else @submit.prevent="saveProfile" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Editar Información</h3>

            <!-- Display fixed email address (not editable) -->
            <div class="bg-gray-100 rounded-lg p-4">
              <label class="block text-sm text-gray-500">Email</label>
              <p class="font-medium">{{ user.email }}</p>
              <p class="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
            </div>

            <!-- Editable fields -->
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700"
                  >Nombre</label
                >
                <input
                  id="firstName"
                  v-model="editForm.firstName"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700"
                  >Apellido</label
                >
                <input
                  id="lastName"
                  v-model="editForm.lastName"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <!-- Error message -->
            <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-md">
              {{ error }}
            </div>

            <!-- Save button -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors disabled:opacity-50"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">
                  <span
                    class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"
                  ></span>
                  Guardando...
                </span>
                <span v-else>Guardar Cambios</span>
              </button>
            </div>
          </form>

          <!-- Actions -->
          <div class="flex justify-end pt-4 border-t">
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
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUserProfile } from '~/composables/useUserProfile'
import { useNotifications } from '~/composables/useNotifications'
import AuthModal from '~/components/auth/Modal.vue'
import {
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Pencil as PencilIcon,
  X as XIcon
} from 'lucide-vue-next'

// Define page meta data for middleware
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true
})

// State
const { user, isAuthenticated, authLoading, logout, fetchUserProfile } = useAuth()
const { updateProfile, isLoading: profileLoading } = useUserProfile()
const { success, error: showError } = useNotifications()
const showAuthModal = ref(false)
const editMode = ref(false)
const isSubmitting = ref(false)
const error = ref(null)

// Form state for editing
const editForm = ref({
  firstName: '',
  lastName: ''
})

// User initials for avatar
const userInitials = computed(() => {
  if (!user.value) return '?'

  const firstName = user.value.firstName || ''
  const lastName = user.value.lastName || ''

  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()

  return firstInitial + (lastInitial || '')
})

// Toggle edit mode
const toggleEditMode = () => {
  if (!editMode.value) {
    // Initialize form with current values
    editForm.value = {
      firstName: user.value?.firstName || '',
      lastName: user.value?.lastName || ''
    }
  }

  editMode.value = !editMode.value
}

// Cancel edit and reset form
const cancelEdit = () => {
  editMode.value = false
  error.value = null
}

// Save profile changes
const saveProfile = async () => {
  if (!user.value) return

  isSubmitting.value = true
  error.value = null

  try {
    const userId = user.value.id
    const result = await updateProfile(userId, {
      firstName: editForm.value.firstName,
      lastName: editForm.value.lastName
    })

    if (result) {
      // Refresh user data to reflect changes
      await fetchUserProfile()

      // Exit edit mode
      editMode.value = false

      // Show success notification
      success('Perfil actualizado', 'Tu información ha sido actualizada correctamente')
    } else {
      error.value = 'No se pudo actualizar el perfil'
    }
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = err instanceof Error ? err.message : 'Error al actualizar el perfil'
    showError('Error', 'No se pudo actualizar el perfil')
  } finally {
    isSubmitting.value = false
  }
}

// Handle login success
const handleLogin = data => {
  console.log('Login successful:', data)
  showAuthModal.value = false
}

// Initialize
onMounted(async () => {
  if (isAuthenticated.value && user.value) {
    // Initialize form with current user data
    editForm.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || ''
    }
  }
})
</script>
