<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
      <!-- Close button (X) -->
      <button
        class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        @click="$emit('close')"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="text-center mb-8 mt-2">
        <h2 class="text-2xl font-bold">
          {{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </h2>
        <p class="text-gray-600 mt-2">
          {{ isLogin ? 'Bienvenido de vuelta' : 'Únete a la comunidad legal' }}
        </p>
      </div>
      <!-- Social Login (Disabled for now) -->
      <button
        class="w-full flex items-center justify-center gap-2 border rounded-md p-3 hover:bg-gray-50 mb-4 opacity-50 cursor-not-allowed"
        disabled
      >
        <img
          src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
          alt="Google"
          class="w-5 h-5"
        />
        Continuar con Google (Próximamente)
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
        <!-- Name fields for signup only -->
        <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700"> Nombre </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="mt-2 block w-full rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Nombre"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700"> Apellido </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="mt-2 block w-full rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Apellido"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="mt-2 block w-full rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="mt-2 block w-full rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
            class="mt-2 block w-full rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div v-if="!isLogin" class="space-y-3">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="isLawyer"
                v-model="form.isLawyer"
                type="checkbox"
                class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="isLawyer" class="font-medium text-gray-700"> Soy abogado(a) </label>
              <p class="text-gray-500">
                Marque esta casilla si es abogado y desea crear un perfil profesional para recibir
                consultas de clientes.
              </p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <p v-if="authError" class="text-red-600 text-sm">{{ authError }}</p>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-primary-800 text-white rounded-md py-2 px-4 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          :disabled="authLoading"
        >
          <span v-if="authLoading">
            <span
              class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"
            ></span>
            Cargando...
          </span>
          <span v-else>{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'login', data: any): void
}>()

const isLogin = ref(true)
const { authLoading, authError, login, signup } = useAuth()

const form = ref({
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: '',
  isLawyer: false
})

const resetForm = () => {
  form.value = {
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    isLawyer: false
  }
}

// Computed property for validating passwords match
const passwordsMatch = computed(() => {
  return isLogin.value || form.value.password === form.value.passwordConfirm
})

// ESC key handler
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Add and remove ESC key listener
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

const handleSubmit = async () => {
  // Basic validation
  if (!isLogin.value && !passwordsMatch.value) {
    // Don't use authError directly to avoid conflicts with API errors
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    let result

    if (isLogin.value) {
      // Login flow
      result = await login(form.value.email, form.value.password)
    } else {
      // Signup flow
      result = await signup(
        form.value.email,
        form.value.password,
        form.value.firstName,
        form.value.lastName,
        form.value.isLawyer,
      )
    }

    if (result.success) {
      emit('login', {
        provider: 'email',
        email: form.value.email
      })
      emit('close')
      resetForm()
    }
  } catch (e) {
    console.error('Authentication error:', e)
  }
}
</script>
