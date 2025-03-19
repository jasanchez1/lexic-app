<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading States -->
    <div v-if="questionLoading || answersLoading" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <span class="text-gray-500">Cargando...</span>
    </div>

    <!-- Error States -->
    <div v-else-if="questionError || answersError" class="max-w-7xl mx-auto px-4 py-12">
      <div class="bg-red-50 p-4 rounded-md text-red-700">
        {{ questionError || answersError }}
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="question">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Question and Answers -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Question -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h1 class="text-2xl font-bold text-gray-900 mb-4">
                {{ question.title }}
              </h1>

              <div class="prose max-w-none mb-6">
                <p>{{ question.content }}</p>
              </div>

              <div class="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <div class="flex items-center gap-4">
                  <span>{{ question.author.name }}</span>
                  <span>{{ question.author.location }}</span>
                  <span>{{ formatDate(question.date) }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span>{{ question.viewCount }} vistas</span>
                </div>
              </div>
            </div>

            <!-- Answers -->
            <div class="space-y-6">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold">{{ answers.length }} Respuestas</h2>

                <!-- Add Answer button for authenticated users -->
                <button
                  v-if="isAuthenticated"
                  @click="showAddAnswerForm = !showAddAnswerForm"
                  class="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {{ showAddAnswerForm ? 'Cancelar' : 'Agregar respuesta' }}
                </button>
              </div>

              <!-- Add Answer Form -->
              <div v-if="showAddAnswerForm" class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-medium mb-4">Tu respuesta</h3>
                <textarea
                  v-model="newAnswerContent"
                  rows="6"
                  class="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Escribe tu respuesta aquí..."
                ></textarea>
                <div class="flex justify-end mt-4">
                  <button
                    @click="submitAnswer"
                    class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    :disabled="isSubmittingAnswer"
                  >
                    {{ isSubmittingAnswer ? 'Enviando...' : 'Publicar respuesta' }}
                  </button>
                </div>
              </div>

              <!-- List of answers -->
              <AnswerCard v-for="answer in answers" :key="answer.id" :answer="answer" />
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <!-- Ask Question Card -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold mb-4">¿Tiene una pregunta similar?</h3>
              <p class="text-gray-600 mb-4">Obtenga respuestas gratuitas de abogados expertos.</p>
              <NuxtLink
                to="/questions/ask"
                class="block text-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Hacer una Pregunta
              </NuxtLink>
            </div>

            <!-- Related Topics -->
            <div class="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h3 class="text-lg font-semibold mb-4">Temas Relacionados</h3>
              <div class="space-y-2">
                <div v-if="isLoadingTopics" class="text-sm text-gray-500">Cargando temas...</div>
                <NuxtLink
                  v-for="topic in relatedTopics"
                  :key="topic.id"
                  :to="`/questions/topics/${topic.slug}`"
                  class="block text-gray-600 hover:text-primary-600"
                >
                  {{ topic.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuestions } from '~/composables/useQuestions'
import { useAnswers } from '~/composables/useAnswers'
import { useLegalTopics } from '~/composables/useLegalTopics'
import { useAuth } from '~/composables/useAuth'
import { formatDate } from '~/utils/date'
import type { Question } from '~/types/question'
import type { LegalTopic } from '~/types/legalTopics'
import { useAnalytics } from '~/composables/useAnalytics'

const { trackQuestionView } = useAnalytics()


const route = useRoute()
const { fetchQuestion, isLoading: questionLoading, error: questionError } = useQuestions()
const {
  answers,
  fetchAnswers,
  createAnswer,
  isLoading: answersLoading,
  error: answersError
} = useAnswers()
const { topics, isLoading: isLoadingTopics, fetchTopics } = useLegalTopics()
const { isAuthenticated } = useAuth()

const question = ref<Question | null>(null)
const showAddAnswerForm = ref(false)
const newAnswerContent = ref('')
const isSubmittingAnswer = ref(false)

// Related topics based on question.topicIds
const relatedTopics = computed(() => {
  if (!question.value || !question.value.topicIds || !topics.value.length) return []

  const result: LegalTopic[] = []

  // Get all topics and subtopics
  const allTopics: LegalTopic[] = [...topics.value, ...topics.value.flatMap(t => t.subtopics || [])]

  // Find topics that match the question's topicIds
  question.value.topicIds.forEach(id => {
    const found = allTopics.find(t => t.id === id)
    if (found) result.push(found)
  })

  return result
})

const submitAnswer = async () => {
  if (!question.value || !newAnswerContent.value.trim() || !isAuthenticated.value) return

  isSubmittingAnswer.value = true
  try {
    await createAnswer(question.value.id, newAnswerContent.value)
    newAnswerContent.value = ''
    showAddAnswerForm.value = false
  } catch (error) {
    console.error('Error submitting answer:', error)
  } finally {
    isSubmittingAnswer.value = false
  }
}

onMounted(async () => {
  await fetchTopics()
  const result = await fetchQuestion(route.params.id as string)
  if (result) {
    question.value = result
    await fetchAnswers(result.id)
    
    trackQuestionView(result.id)
  }
})
</script>
