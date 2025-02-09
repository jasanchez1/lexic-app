<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
                <NuxtLink
                  v-for="topicId in question.topicIds"
                  :key="topicId"
                  :to="`/questions/topics/${topicId}`"
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
