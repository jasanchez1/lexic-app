<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b flex justify-between items-start">
        <div>
          <h2 class="text-xl font-bold">
            {{ isEditing ? 'Editar reseña' : 'Reseña para ' + lawyer.name }}
          </h2>
          <p class="text-sm text-gray-600">{{ lawyer.title }}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600" @click="$emit('close')">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Guidelines Panel - only show on new review creation -->
      <div v-if="!isEditing" class="bg-blue-50 m-6 p-4 rounded-lg">
        <h3 class="font-medium mb-2">Pautas para reseñas</h3>
        <ul class="space-y-2 text-sm text-gray-600">
          <li class="flex gap-2">
            <InfoIcon class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            Solo aceptamos reseñas de clientes que hayan contratado o consultado con el abogado.
          </li>
          <li class="flex gap-2">
            <CheckCircleIcon class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            Sea específico sobre su experiencia con el abogado.
          </li>
          <li class="flex gap-2">
            <AlertCircleIcon class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            No incluya información personal identificable.
          </li>
        </ul>
      </div>

      <!-- Form -->
      <form class="p-6 space-y-6" @submit.prevent="handleSubmit">
        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 required">
            Calificación general
          </label>
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              class="p-1 hover:scale-110 transition-transform"
              @click="form.rating = i"
            >
              <Star
                class="w-8 h-8"
                :class="
                  i <= form.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 fill-gray-300'
                "
              />
            </button>
          </div>
          <p v-if="errors.rating" class="mt-1 text-sm text-red-600">
            {{ errors.rating }}
          </p>
        </div>

        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2 required">
            Título de la reseña
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            maxlength="128"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :class="{ 'border-red-300': errors.title }"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <!-- Review Content -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2 required">
            Su experiencia
          </label>
          <textarea
            id="content"
            v-model="form.content"
            rows="4"
            maxlength="4000"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :class="{ 'border-red-300': errors.content }"
            placeholder="Explique su experiencia con el abogado..."
          />
          <p v-if="errors.content" class="mt-1 text-sm text-red-600">
            {{ errors.content }}
          </p>
        </div>

        <!-- Hired Status - only show when creating new review -->
        <div v-if="!isEditing">
          <label class="block text-sm font-medium text-gray-700 mb-2 required">
            ¿Contrató al abogado?
          </label>
          <div class="space-x-4">
            <label class="inline-flex items-center">
              <input
                v-model="form.isHired"
                type="radio"
                :value="true"
                name="isHired"
                class="text-primary-600"
              />
              <span class="ml-2">Sí</span>
            </label>
            <label class="inline-flex items-center">
              <input
                v-model="form.isHired"
                type="radio"
                :value="false"
                name="isHired"
                class="text-primary-600"
              />
              <span class="ml-2">Solo consulta</span>
            </label>
          </div>
          <p v-if="errors.isHired" class="mt-1 text-sm text-red-600">
            {{ errors.isHired }}
          </p>
        </div>

        <!-- Author Info - only show when creating new review -->
        <div v-if="!isEditing" class="space-y-4">
          <div v-if="!form.isAnonymous">
            <label for="authorName" class="block text-sm font-medium text-gray-700 mb-2 required">
              Su nombre
            </label>
            <input
              id="authorName"
              v-model="form.authorName"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              :class="{ 'border-red-300': errors.authorName }"
            />
            <p v-if="errors.authorName" class="mt-1 text-sm text-red-600">
              {{ errors.authorName }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="inline-flex items-center">
              <input
                v-model="form.isAnonymous"
                type="checkbox"
                class="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
              <span class="ml-2 text-sm text-gray-700">Publicar reseña anónimamente</span>
            </label>
            <p class="text-sm text-gray-500 ml-6">
              Su nombre no será visible públicamente si selecciona esta opción.
            </p>
          </div>

          <div>
            <label for="authorEmail" class="block text-sm font-medium text-gray-700 mb-2 required">
              Su email
            </label>
            <input
              id="authorEmail"
              v-model="form.authorEmail"
              type="email"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              :class="{ 'border-red-300': errors.authorEmail }"
            />
            <p class="mt-1 text-xs text-gray-500">
              Solo lo usaremos para contactarlo sobre su reseña. No será público.
            </p>
            <p v-if="errors.authorEmail" class="mt-1 text-sm text-red-600">
              {{ errors.authorEmail }}
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            class="px-4 py-2 border rounded-md hover:bg-gray-50"
            @click="$emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Enviando...' : isEditing ? 'Actualizar Reseña' : 'Publicar Reseña' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import {
  Star,
  X as XIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import type { Lawyer } from '~/types/lawyer'
import type { LawyerReview } from '~/types/review'

const props = defineProps<{
  show: boolean
  lawyer: Lawyer
  reviewToEdit?: LawyerReview // New prop for editing an existing review
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', review: any): void
  (e: 'update', reviewId: string, review: any): void
}>()

const isSubmitting = ref(false)
const errors = reactive({
  rating: '',
  title: '',
  content: '',
  isHired: '',
  authorName: '',
  authorEmail: ''
})

// Default form state
const defaultForm = {
  rating: 0,
  title: '',
  content: '',
  isHired: null as boolean | null,
  authorName: '',
  authorEmail: '',
  isAnonymous: false
}

const form = reactive({ ...defaultForm })

// Computed property to determine if we're in edit mode
const isEditing = computed(() => !!props.reviewToEdit)

// Auth state
const { isAuthenticated, user } = useAuth()

// When user data changes, update form
watch(user, newUser => {
  if (newUser && !isEditing.value) {
    form.authorName = newUser.firstName + ' ' + (newUser.lastName || '')
    form.authorEmail = newUser.email
  }
})

// When reviewToEdit changes, populate the form
watch(
  () => props.reviewToEdit,
  newReview => {
    if (newReview) {
      form.rating = newReview.rating
      form.title = newReview.title || ''
      form.content = newReview.content
      form.isHired = newReview.isHired
      form.isAnonymous = newReview.author?.name === 'Anónimo'
    } else {
      // Reset form when not editing
      Object.assign(form, defaultForm)

      // Populate with user data if available
      if (user.value) {
        form.authorName = user.value.firstName + ' ' + (user.value.lastName || '')
        form.authorEmail = user.value.email
      }
    }
  },
  { immediate: true }
)

const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => (errors[key as keyof typeof errors] = ''))

  if (!form.rating) {
    errors.rating = 'Por favor seleccione una calificación'
    isValid = false
  }

  if (!form.title.trim()) {
    errors.title = 'Por favor ingrese un título'
    isValid = false
  }

  if (form.content.trim().length < 20) {
    errors.content = 'La reseña debe tener al menos 20 caracteres'
    isValid = false
  }

  // Only validate these fields when creating a new review
  if (!isEditing.value) {
    if (!form.isAnonymous && !form.authorName.trim()) {
      errors.authorName = 'Por favor ingrese su nombre'
      isValid = false
    }

    if (form.isHired === null) {
      errors.isHired = 'Por favor seleccione una opción'
      isValid = false
    }

    if (!form.authorName.trim()) {
      errors.authorName = 'Por favor ingrese su nombre'
      isValid = false
    }

    if (!form.authorEmail.trim()) {
      errors.authorEmail = 'Por favor ingrese su email'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.authorEmail)) {
      errors.authorEmail = 'Por favor ingrese un email válido'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  // First check if user is authenticated
  if (!isAuthenticated.value) {
    emit('close')
    return
  }

  if (!validateForm()) return

  isSubmitting.value = true

  try {
    if (isEditing.value && props.reviewToEdit) {
      // When updating, only send the fields that are actually changed
      // This preserves original values for fields we don't touch
      emit('update', props.reviewToEdit.id, {
        rating: form.rating,
        title: form.title,
        content: form.content
        // Don't include is_anonymous or is_hired if we don't edit them
        // They will remain as they were in the original review
      })
    } else {
      // Create new review
      emit('submit', {
        ...form,
        date: new Date().toISOString(),
        lawyerId: props.lawyer.id,
        authorName: form.isAnonymous ? 'Anónimo' : form.authorName
      })
    }

    // Close modal
    emit('close')
  } catch (error) {
    console.error('Error submitting review:', error)
    // Handle error
  } finally {
    isSubmitting.value = false
  }
}

// Initialize form when mounted
onMounted(() => {
  if (user.value && !isEditing.value) {
    form.authorName = user.value.firstName + ' ' + (user.value.lastName || '')
    form.authorEmail = user.value.email
  }
})
</script>

<style scoped>
.required:after {
  content: ' *';
  color: #ef4444;
}
</style>
