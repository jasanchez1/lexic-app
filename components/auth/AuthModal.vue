<!-- components/auth/AuthModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold">
          {{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </h2>
        <p class="text-gray-600 mt-2">
          {{ isLogin ? 'Bienvenido de vuelta' : 'Únete a la comunidad legal' }}
        </p>
      </div>

      <!-- Social Login -->
      <button
        class="w-full flex items-center justify-center gap-2 border rounded-md p-3 hover:bg-gray-50 mb-4"
        @click="handleGoogleLogin"
      >
        <img src="/google-icon.svg" alt="Google" class="w-5 h-5" />
        Continuar con Google
      </button>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">o</span>
        </div>
      </div>

      <!-- Email Form -->
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div v-if="!isLogin">
          <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-primary-800 text-white rounded-md py-2 px-4 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </button>
      </form>

      <!-- Toggle Login/Signup -->
      <p class="mt-4 text-center text-sm text-gray-600">
        {{ isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?' }}
        <button
          class="text-primary-800 hover:text-primary-900 font-medium"
          @click="isLogin = !isLogin"
        >
          {{ isLogin ? 'Regístrate' : 'Inicia sesión' }}
        </button>
      </p>

      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        @click="$emit('close')"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

// eslint-disable-next-line no-unused-vars
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'close'): void
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  (e: 'login', data: any): void
}>()

const isLogin = ref(true)
const isLoading = ref(false)
const error = ref('')

const form = ref({
  email: '',
  password: '',
  passwordConfirm: ''
})

const handleGoogleLogin = async () => {
  isLoading.value = true
  try {
    // Mock Google login
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('login', { provider: 'google', email: 'user@example.com' })
    emit('close')
  } catch (e) {
    error.value = 'Error al iniciar sesión con Google'
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  error.value = ''

  // Basic validation
  if (!isLogin.value && form.value.password !== form.value.passwordConfirm) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  isLoading.value = true
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('login', {
      provider: 'email',
      email: form.value.email
    })
    emit('close')
  } catch (e) {
    error.value = 'Error al iniciar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>
