<!-- pages/questions/[id].vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckCircle } from 'lucide-vue-next'
import { useQuestions } from '~/composables/useQuestions'
import { useAnswers } from '~/composables/useAnswers'
import { formatDate } from '~/utils/date'
import type { Question } from '~/types/question'

const route = useRoute()
const { fetchQuestion, isLoading: questionLoading, error: questionError } = useQuestions()
const { answers, fetchAnswers, isLoading: answersLoading, error: answersError } = useAnswers()

const question = ref<Question | null>(null)

onMounted(async () => {
  const result = await fetchQuestion(route.params.id as string)
  if (result) {
    question.value = result
    await fetchAnswers(result.id)
  }
})
</script>

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
              <h2 class="text-xl font-semibold">{{ answers.length }} Respuestas</h2>

              <div
                v-for="answer in answers"
                :key="answer.id"
                class="bg-white rounded-lg shadow-sm border p-6"
                :class="{ 'border-green-500': answer.isAccepted }"
              >
                <!-- Answer Content -->
                <div class="prose max-w-none mb-6">
                  <p>{{ answer.content }}</p>
                </div>

                <!-- Answer Footer -->
                <div class="flex items-center justify-between border-t pt-4">
                  <!-- Author Info -->
                  <div class="flex items-center">
                    <img
                      v-if="answer.author.imageUrl"
                      :src="answer.author.imageUrl"
                      :alt="answer.author.name"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div class="ml-3">
                      <div class="font-medium text-gray-900">
                        {{ answer.author.name }}
                        <span
                          v-if="answer.author.isVerified"
                          class="inline-flex items-center text-green-600 text-sm ml-2"
                        >
                          <CheckCircle class="w-4 h-4 mr-1" />
                          Verificado
                        </span>
                      </div>
                      <div class="text-sm text-gray-500">{{ answer.author.title }}</div>
                      <div class="flex items-center mt-1 text-sm text-gray-500">
                        <StarRating 
                          :score="answer.author.rating" 
                          :show-score="true" 
                          class="mr-2"
                        />
                        {{ answer.author.reviewCount }} reseñas
                      </div>
                    </div>
                  </div>

                  <!-- Metadata -->
                  <div class="text-sm text-gray-500">
                    <div class="flex items-center gap-4">
                      <span>{{ formatDate(answer.date) }}</span>
                      <span>{{ answer.upvotes }} votos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <!-- Ask Question Card -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold mb-4">¿Tiene una pregunta similar?</h3>
              <p class="text-gray-600 mb-4">
                Obtenga respuestas gratuitas de abogados expertos.
              </p>
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
                <NuxtLink
                  v-for="topicId in question.topicIds"
                  :key="topicId"
                  :to="`/questions/topic/${topicId}`"
                  class="block text-gray-600 hover:text-primary-600"
                >
                  {{ topicId }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>