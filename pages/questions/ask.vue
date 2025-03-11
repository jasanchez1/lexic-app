<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Warning dialog when navigating away -->
    <div v-if="showNavigationWarning" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 class="text-xl font-bold mb-4">¿Abandonar la pregunta?</h2>
        <p class="text-gray-600 mb-6">Si sales ahora perderás los cambios en tu pregunta. ¿Estás seguro de que quieres salir?</p>

        <div class="flex gap-3">
          <button 
            @click="confirmLeave"
            class="flex-1 bg-gray-100 text-gray-700 p-3 rounded-md font-medium hover:bg-gray-200"
          >
            Sí, salir
          </button>
          
          <button 
            @click="cancelLeave"
            class="flex-1 bg-primary-600 text-white p-3 rounded-md font-medium hover:bg-primary-700"
          >
            Continuar editando
          </button>
        </div>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="bg-white border-b">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex items-center text-primary-600">
              <div class="rounded-full bg-primary-100 p-1">
                <Check v-if="currentStep !== 'ask'" class="w-5 h-5" />
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
      <!-- Auth Check Overlay -->
      <div v-if="showAuthOverlay" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <h2 class="text-xl font-bold mb-4 text-gray-900">Inicia sesión para continuar</h2>
          <p class="text-gray-600 mb-6">Para publicar una pregunta y recibir respuestas de expertos legales, necesitas iniciar sesión.</p>

          <div class="space-y-4">
            <button 
              @click="openLoginModal()"
              class="w-full bg-primary-600 text-white p-3 rounded-md font-medium hover:bg-primary-700"
            >
              Iniciar Sesión / Crear Cuenta
            </button>
            
            <button 
              @click="showAuthOverlay = false"
              class="w-full border border-gray-300 p-3 rounded-md font-medium text-gray-700 hover:bg-gray-50"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      <!-- Ask Step -->
      <template v-if="currentStep === 'ask'">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Preguntas y respuestas gratuitas</h1>
        <p class="text-gray-600 mb-8">Cada 5 segundos alguien recibe asesoría legal gratuita.</p>

        <div v-if="error" class="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {{ error }}
        </div>

        <form class="space-y-6" @submit.prevent="handleReview">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 required"
              >Pregunta</label
            >
            <textarea
              id="title"
              v-model="formData.title"
              rows="2"
              maxlength="128"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Comience su pregunta con 'cómo', 'qué', 'por qué', 'cuándo'..."
              @input="markAsDirty"
            />
            <p class="mt-1 text-sm text-right text-gray-500">{{ formData.title.length }}/128</p>
          </div>

          <!-- Details -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 required">
              Detalles de su situación
            </label>
            <textarea
              id="content"
              v-model="formData.content"
              rows="6"
              maxlength="1200"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Proporcione detalles claves. No es necesario que sea perfecto, puede hacer aclaraciones después."
              @input="markAsDirty"
            />
            <p class="mt-1 text-sm text-right text-gray-500">{{ formData.content.length }}/1200</p>
          </div>

          <!-- Topic Selection with Typeahead -->
          <div>
            <label class="block text-sm font-medium text-gray-700 required">
              Tema Legal
            </label>
            <div class="mt-2">
              <div v-if="topicsLoading" class="py-2">
                <span class="text-sm text-gray-500">Cargando temas...</span>
              </div>
              <div v-else>
                <div class="relative topic-dropdown">
                  <input
                    type="text"
                    v-model="topicSearch"
                    placeholder="Buscar temas legales..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
                    @focus="showTopicOptions = true"
                    @click.stop
                  />
                  
                  <!-- Topic dropdown -->
                  <div
                    v-if="showTopicOptions"
                    class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto"
                    @click.stop
                  >
                    <div 
                      v-for="topic in filteredTopics" 
                      :key="topic.id"
                      class="p-2 hover:bg-gray-100 cursor-pointer"
                      @click.stop="addTopic(topic)"
                    >
                      {{ topic.name }}
                    </div>
                    <div 
                      v-for="topic in topics" 
                      :key="`parent-${topic.id}`"
                    >
                      <div
                        v-for="subtopic in topic.subtopics || []"
                        :key="`child-${subtopic.id}`"
                        v-show="subtopic.name.toLowerCase().includes(topicSearch.toLowerCase())"
                        class="p-2 pl-6 hover:bg-gray-100 cursor-pointer text-sm"
                        @click.stop="addTopic(subtopic)"
                      >
                        {{ subtopic.name }} <span class="text-gray-500 text-xs">({{ topic.name }})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Selected Topics -->
                <div v-if="selectedTopics.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <div
                    v-for="topic in selectedTopics"
                    :key="topic.id"
                    class="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {{ topic.name }}
                    <button
                      type="button"
                      class="ml-1 text-primary-500 hover:text-primary-700"
                      @click.stop="removeTopic(topic.id)"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <!-- Show validation message only after form submission attempt -->
                <p v-else-if="formSubmitted" class="mt-2 text-xs text-red-500">
                  Por favor, seleccione al menos un tema legal
                </p>
              </div>
            </div>
          </div>

          <!-- City Selection Dropdown -->
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 required">
              Ciudad
            </label>
            <div class="mt-2 relative">
              <div v-if="citiesLoading" class="py-2">
                <span class="text-sm text-gray-500">Cargando ciudades...</span>
              </div>
              <div v-else>
                <div class="relative city-dropdown">
                  <input
                    type="text"
                    v-model="citySearch"
                    placeholder="Seleccione una ciudad..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
                    @focus="showCityOptions = true"
                    @click.stop
                  />
                  
                  <!-- City dropdown -->
                  <div
                    v-if="showCityOptions && filteredCities.length > 0"
                    class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto"
                    @click.stop
                  >
                    <div 
                      v-for="city in filteredCities" 
                      :key="city.id"
                      class="p-2 hover:bg-gray-100 cursor-pointer"
                      @click.stop="selectCity(city)"
                    >
                      {{ city.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                  v-model="formData.planToHire"
                  type="radio"
                  value="yes"
                  name="planToHire"
                  class="text-primary-600"
                  @change="markAsDirty"
                />
                <span class="ml-2">Sí</span>
              </label>
              <br />
              <label class="inline-flex items-center">
                <input
                  v-model="formData.planToHire"
                  type="radio"
                  value="maybe"
                  name="planToHire"
                  class="text-primary-600"
                  @change="markAsDirty"
                />
                <span class="ml-2">No estoy seguro</span>
              </label>
              <br />
              <label class="inline-flex items-center">
                <input
                  v-model="formData.planToHire"
                  type="radio"
                  value="no"
                  name="planToHire"
                  class="text-primary-600"
                  @change="markAsDirty"
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
                <p class="mt-2">{{ formData.title }}</p>
                <button
                  class="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  @click="moveToEdit()"
                >
                  Editar
                </button>
              </div>

              <!-- Details Preview -->
              <div>
                <h3 class="font-medium text-gray-900">Detalles</h3>
                <p class="mt-2 whitespace-pre-wrap">{{ formData.content }}</p>
              </div>

              <!-- Topics Preview -->
              <div>
                <h3 class="font-medium text-gray-900">Temas</h3>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span 
                    v-for="topic in selectedTopics" 
                    :key="topic.id"
                    class="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                  >
                    {{ topic.name }}
                  </span>
                </div>
              </div>

              <!-- Location Preview -->
              <div>
                <h3 class="font-medium text-gray-900">Ciudad</h3>
                <p class="mt-2">{{ selectedCity ? selectedCity.name : formData.location }}</p>
              </div>

              <!-- Intent Preview -->
              <div>
                <h3 class="font-medium text-gray-900">¿Planea contratar un abogado?</h3>
                <p class="mt-2">{{ formatHireIntent(formData.planToHire) }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-8 flex items-center justify-between">
              <button
                type="button"
                class="text-gray-600 hover:text-gray-900"
                @click="moveToEdit()"
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
              <a href="#" class="text-primary-600 hover:text-primary-700">Política de privacidad</a>.
            </p>
          </div>
        </div>
      </template>
    </div>

    <!-- Auth Modal -->
    <AuthModal 
      :show="showAuthModal" 
      :initial-mode="'login'"
      @close="showAuthModal = false" 
      @login="handleLoginSuccess" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'
import { useQuestionForm } from '~/composables/useQuestionForm'
import { useLegalTopics } from '~/composables/useLegalTopics'
import { useCities } from '~/composables/useCities'
import { useAuth } from '~/composables/useAuth'
import AuthModal from '~/components/auth/Modal.vue'
import type { LegalTopic } from '~/types/legalTopics'
import type { City } from '~/types/city'

const router = useRouter()
const { formData, currentStep, isSubmitting, error, isDirty, wasSubmitted, moveToReview, moveToEdit, submitQuestion, resetForm, markAsDirty } = useQuestionForm()
const { topics, isLoading: topicsLoading, error: topicsError, fetchTopics } = useLegalTopics()
const { cities, isLoading: citiesLoading, error: citiesError, fetchCities } = useCities()
const { isAuthenticated, user } = useAuth()

// Auth related
const showAuthModal = ref(false)
const showAuthOverlay = ref(false)

// Track form submission attempt
const formSubmitted = ref(false)

// Topic selection
const topicSearch = ref('')
const showTopicOptions = ref(false)
const selectedTopics = ref<LegalTopic[]>([])

// City selection
const citySearch = ref('')
const showCityOptions = ref(false)
const selectedCity = ref<City | null>(null)

// Navigation warning
const showNavigationWarning = ref(false)
const pendingPath = ref<string | null>(null)

// Handle navigation - use router guards instead of onBeforeRouteLeave
router.beforeEach((to, from, next) => {
  if (isDirty.value && !wasSubmitted.value && from.path === '/questions/ask') {
    showNavigationWarning.value = true
    pendingPath.value = to.fullPath
    return next(false)
  }
  return next()
})

// Confirm navigation and reset form
const confirmLeave = () => {
  showNavigationWarning.value = false
  resetForm()
  if (pendingPath.value) {
    router.push(pendingPath.value)
    pendingPath.value = null
  }
}

// Cancel navigation
const cancelLeave = () => {
  showNavigationWarning.value = false
  pendingPath.value = null
}

// Click outside handlers
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  
  // Close topic options if clicking outside
  const topicDropdown = document.querySelector('.topic-dropdown')
  if (topicDropdown && !topicDropdown.contains(target) && showTopicOptions.value) {
    showTopicOptions.value = false
  }
  
  // Close city options if clicking outside
  const cityDropdown = document.querySelector('.city-dropdown')
  if (cityDropdown && !cityDropdown.contains(target) && showCityOptions.value) {
    showCityOptions.value = false
  }
}

// Setup event listeners
onMounted(() => {
  // Reset form state on page load
  resetForm()
  
  // Remove any existing handlers to prevent duplicates
  document.removeEventListener('click', handleClickOutside)
  // Add the handler
  document.addEventListener('click', handleClickOutside)
  
  // Fetch data
  fetchTopics()
  fetchCities()
  
  // Initialize selected topics from formData if already present
  if (formData.value.topicIds.length > 0) {
    // We'll need to wait for topics to load first
    watch(
      () => topicsLoading.value,
      (loading) => {
        if (!loading && topics.value.length > 0) {
          // Find topics by IDs
          formData.value.topicIds.forEach(id => {
            const topic = findTopicById(id)
            if (topic) selectedTopics.value.push(topic)
          })
        }
      },
      { immediate: true }
    )
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Filtered topics based on search input
const filteredTopics = computed(() => {
  if (!topicSearch.value) return topics.value
  const search = topicSearch.value.toLowerCase()
  return topics.value.filter(t => t.name.toLowerCase().includes(search))
})

// Filtered cities based on search input
const filteredCities = computed(() => {
  if (!citySearch.value) return cities.value
  const search = citySearch.value.toLowerCase()
  return cities.value.filter(c => c.name.toLowerCase().includes(search))
})

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.title.length > 0 &&
    formData.value.content.length > 0 &&
    (selectedCity.value !== null || formData.value.location.length > 0) &&
    formData.value.planToHire !== null &&
    (selectedTopics.value.length > 0 || formData.value.topicIds.length > 0)
  )
})

// Add a topic to the selection
const addTopic = (topic: LegalTopic) => {
  // Don't add duplicates
  if (!selectedTopics.value.some(t => t.id === topic.id)) {
    selectedTopics.value.push(topic)
    formData.value.topicIds.push(topic.id)
    markAsDirty()
  }
  topicSearch.value = ''
  showTopicOptions.value = false
}

// Remove a topic from the selection
const removeTopic = (topicId: string) => {
  selectedTopics.value = selectedTopics.value.filter(t => t.id !== topicId)
  formData.value.topicIds = formData.value.topicIds.filter(id => id !== topicId)
  markAsDirty()
}

// Select a city
const selectCity = (city: City) => {
  selectedCity.value = city
  citySearch.value = city.name
  formData.value.location = city.name  // Keep the location field synchronized
  formData.value.cityId = city.id      // Store the city ID for API
  showCityOptions.value = false
  markAsDirty()
}

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

// Open login modal directly
const openLoginModal = () => {
  showAuthModal.value = true
  showAuthOverlay.value = false
}

// Handle login success
const handleLoginSuccess = () => {
  showAuthModal.value = false
  
  // If user is now authenticated, proceed to review
  if (isAuthenticated.value) {
    // Update selected topics if not already selected
    if (selectedTopics.value.length === 0 && formData.value.topicIds.length > 0) {
      formData.value.topicIds.forEach(id => {
        const topic = findTopicById(id)
        if (topic) selectedTopics.value.push(topic)
      })
    }
    
    moveToReview()
  }
}

// Helper to find a topic by ID
const findTopicById = (id: string): LegalTopic | null => {
  // Check main topics
  const mainTopic = topics.value.find(t => t.id === id)
  if (mainTopic) return mainTopic
  
  // Check subtopics
  for (const topic of topics.value) {
    if (topic.subtopics) {
      const subtopic = topic.subtopics.find(s => s.id === id)
      if (subtopic) return subtopic
    }
  }
  return null
}

// Handle review button
const handleReview = () => {
  // Mark that form submission was attempted
  formSubmitted.value = true
  
  if (!isFormValid.value) return
  
  // Transfer the selected topics to the form data
  formData.value.topicIds = selectedTopics.value.map(t => t.id)
  markAsDirty()
  
  // Check if authenticated
  if (!isAuthenticated.value) {
    showAuthOverlay.value = true
  } else {
    moveToReview()
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!isAuthenticated.value) {
    showAuthOverlay.value = true
    return
  }
  
  const result = await submitQuestion()
  
  if (result.success && result.question) {
    // Navigate to the question page
    router.push(`/questions/${result.question.id}`)
  }
}

// Watch authentication state
watch(isAuthenticated, (newValue) => {
  if (newValue && showAuthOverlay.value) {
    showAuthOverlay.value = false
    moveToReview()
  }
})

// Reset form when entering the page
onMounted(() => {
  resetForm()
})
</script>

<style scoped>
.required:after {
  content: ' *';
  color: #ef4444;
}
</style>