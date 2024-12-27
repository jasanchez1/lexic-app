<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useQuestions } from '~/composables/useQuestions'
import { useLegalTopics } from '~/composables/useLegalTopics'
import { formatDate } from '~/utils/date'

const route = useRoute()
const { questions, isLoading, error, fetchQuestions } = useQuestions()
const { topics, fetchTopics } = useLegalTopics()

const currentTopic = computed(
  () =>
    topics.value.find(topic => topic.slug === route.params.slug) ||
    topics.value.flatMap(t => t.subtopics || []).find(st => st.slug === route.params.slug)
)

onMounted(async () => {
  await fetchTopics()
  await fetchQuestions(currentTopic.value?.id)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Topic Header -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div v-if="currentTopic" class="space-y-4">
          <h1 class="text-3xl font-bold text-gray-900">{{ currentTopic.name }}</h1>
          <p class="text-gray-600">{{ currentTopic.description }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Questions List -->
        <div class="lg:col-span-2">
          <div v-if="isLoading" class="text-center py-12">
            <span class="text-gray-500">Cargando preguntas...</span>
          </div>

          <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700">
            {{ error }}
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="question in questions"
              :key="question.id"
              class="bg-white rounded-lg shadow-sm border p-6"
            >
              <NuxtLink :to="`/questions/${question.id}`" class="block space-y-4">
                <h2 class="text-xl font-semibold text-gray-900 hover:text-primary-600">
                  {{ question.title }}
                </h2>
                <p class="text-gray-600 line-clamp-2">{{ question.content }}</p>

                <div class="flex items-center justify-between text-sm text-gray-500">
                  <div class="flex items-center gap-4">
                    <span>{{ question.author.location }}</span>
                    <span>{{ formatDate(question.date) }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span>{{ question.answerCount }} respuestas</span>
                    <span>{{ question.viewCount }} vistas</span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Ask Question Card -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">¿Tiene una pregunta legal?</h3>
            <p class="text-gray-600 mb-4">Obtenga respuestas gratuitas de abogados expertos.</p>
            <NuxtLink
              to="/questions/ask"
              class="block text-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Hacer una Pregunta
            </NuxtLink>
          </div>

          <!-- Related Topics -->
          <div v-if="currentTopic?.subtopics" class="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h3 class="text-lg font-semibold mb-4">Temas Relacionados</h3>
            <div class="space-y-2">
              <NuxtLink
                v-for="subtopic in currentTopic.subtopics"
                :key="subtopic.id"
                :to="`/questions/topics/${subtopic.slug}`"
                class="block text-gray-600 hover:text-primary-600"
              >
                {{ subtopic.name }}
                <span class="text-gray-400">({{ subtopic.questionsCount }})</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
