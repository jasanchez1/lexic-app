<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Progress Steps -->
    <div class="bg-white border-b">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex items-center text-primary-600">
              <div class="rounded-full bg-primary-100 p-1">
                <Check v-if="currentStep === 'review'" class="w-5 h-5" />
                <span v-else class="w-5 h-5 flex items-center justify-center font-medium">1</span>
              </div>
              <span class="ml-2 font-medium">Preguntar</span>
            </div>
            <div class="w-16 h-px bg-gray-200 mx-4" />
            <div
              class="flex items-center"
              :class="currentStep === 'review' ? 'text-primary-600' : 'text-gray-400'"
            >
              <div
                class="rounded-full p-1"
                :class="currentStep === 'review' ? 'bg-primary-100' : 'bg-gray-100'"
              >
                <span class="w-5 h-5 flex items-center justify-center font-medium">2</span>
              </div>
              <span class="ml-2 font-medium">Revisar</span>
            </div>
            <div class="w-16 h-px bg-gray-200 mx-4" />
            <div class="flex items-center text-gray-400">
              <div class="rounded-full bg-gray-100 p-1">
                <span class="w-5 h-5 flex items-center justify-center font-medium">3</span>
              </div>
              <span class="ml-2 font-medium">¡Listo!</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="max-w-3xl mx-auto px-4 py-8">
      <!-- Ask Step -->
      <template v-if="currentStep === 'ask'">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Preguntas y respuestas gratuitas</h1>
        <p class="text-gray-600 mb-8">Cada 5 segundos alguien recibe asesoría legal gratuita.</p>

        <form class="space-y-6" @submit.prevent="handleReview">
          <!-- Your existing form fields -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 required"
              >Pregunta</label
            >
            <textarea
              id="title"
              v-model="form.title"
              rows="2"
              maxlength="128"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Comience su pregunta con 'cómo', 'qué', 'por qué', 'cuándo'..."
            />
            <p class="mt-1 text-sm text-right text-gray-500">{{ form.title.length }}/128</p>
          </div>

          <!-- Details -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 required">
              Detalles de su situación
            </label>
            <textarea
              id="content"
              v-model="form.content"
              rows="6"
              maxlength="1200"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Proporcione detalles claves. No es necesario que sea perfecto, puede hacer aclaraciones después."
            />
            <p class="mt-1 text-sm text-right text-gray-500">{{ form.content.length }}/1200</p>
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 required">
              Ciudad
            </label>
            <input
              id="location"
              v-model="form.location"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Ejemplo: Santiago, Chile"
            />
            <p class="mt-1 text-sm text-gray-500">
              Usamos su ubicación para proporcionar asesoría específica de abogados locales.
            </p>
          </div>

          <!-- Intent to Hire -->
          <div>
            <label class="block text-sm font-medium text-gray-700 required">
              ¿Planea contratar un abogado?
            </label>
            <div class="mt-2 space-y-2">
              <label class="inline-flex items-center">
                <input
                  v-model="form.planToHire"
                  type="radio"
                  value="yes"
                  name="planToHire"
                  class="text-primary-600"
                />
                <span class="ml-2">Sí</span>
              </label>
              <br />
              <label class="inline-flex items-center">
                <input
                  v-model="form.planToHire"
                  type="radio"
                  value="maybe"
                  name="planToHire"
                  class="text-primary-600"
                />
                <span class="ml-2">No estoy seguro</span>
              </label>
              <br />
              <label class="inline-flex items-center">
                <input
                  v-model="form.planToHire"
                  type="radio"
                  value="no"
                  name="planToHire"
                  class="text-primary-600"
                />
                <span class="ml-2">No</span>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <button
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'px-6 py-3 rounded-md text-white font-medium',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                isFormValid
                  ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                  : 'bg-gray-300 cursor-not-allowed'
              ]"
            >
              Revisar
            </button>
          </div>
        </form>
      </template>

      <!-- Review Step -->
      <template v-if="currentStep === 'review'">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-6">Revise su pregunta</h2>
            <p class="text-gray-600 mb-6">
              Su pregunta no es definitiva, puede hacer cambios aquí. Y una vez enviada, podrá
              agregar notas y hacer preguntas de seguimiento.
            </p>

            <div class="space-y-6">
              <!-- Question Preview -->
              <div>
                <h3 class="font-medium text-gray-900">Pregunta</h3>
                <p class="mt-2">{{ form.title }}</p>
                <button
                  class="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  @click="currentStep = 'ask'"
                >
                  Editar
                </button>
              </div>

              <!-- Details Preview -->
              <div>
                <h3 class="font-medium text-gray-900">Detalles</h3>
                <p class="mt-2 whitespace-pre-wrap">{{ form.content }}</p>
              </div>

              <!-- Location Preview -->
              <div>
                <h3 class="font-medium text-gray-900">Ciudad</h3>
                <p class="mt-2">{{ form.location }}</p>
              </div>

              <!-- Intent Preview -->
              <div>
                <h3 class="font-medium text-gray-900">¿Planea contratar un abogado?</h3>
                <p class="mt-2">{{ formatHireIntent(form.planToHire) }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-8 flex items-center justify-between">
              <button
                type="button"
                class="text-gray-600 hover:text-gray-900"
                @click="currentStep = 'ask'"
              >
                ← Volver a editar
              </button>
              <button
                type="button"
                class="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
                :disabled="isSubmitting"
                @click="handleSubmit"
              >
                {{ isSubmitting ? 'Enviando...' : 'Enviar pregunta' }}
              </button>
            </div>

            <!-- Terms -->
            <p class="mt-4 text-sm text-gray-500 text-center">
              Al hacer clic en Enviar, acepta nuestros
              <a href="#" class="text-primary-600 hover:text-primary-700">Términos de uso</a>,
              <a href="#" class="text-primary-600 hover:text-primary-700">Pautas de la comunidad</a>
              y
              <a href="#" class="text-primary-600 hover:text-primary-700">Política de privacidad</a
              >.
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check } from 'lucide-vue-next'

const router = useRouter()

interface QuestionForm {
  title: string
  content: string
  location: string
  planToHire: 'yes' | 'maybe' | 'no' | null
}

const form = ref<QuestionForm>({
  title: '',
  content: '',
  location: '',
  planToHire: null
})

const currentStep = ref<'ask' | 'review'>('ask')
const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return (
    form.value.title.length > 0 &&
    form.value.content.length > 0 &&
    form.value.location.length > 0 &&
    form.value.planToHire !== null
  )
})

const formatHireIntent = (intent: string | null) => {
  switch (intent) {
    case 'yes':
      return 'Sí'
    case 'no':
      return 'No'
    case 'maybe':
      return 'No estoy seguro'
    default:
      return ''
  }
}

const handleReview = () => {
  if (!isFormValid.value) return
  currentStep.value = 'review'
  // eslint-disable-next-line no-undef
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/questions/1')
  } catch (error) {
    console.error('Error submitting question:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.required:after {
  content: ' *';
  color: #ef4444;
}
</style>
