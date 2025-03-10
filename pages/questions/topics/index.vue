<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import { useLegalTopics } from '~/composables/useLegalTopics'

const { topics, isLoading, error, fetchTopics } = useLegalTopics()
const searchQuery = ref('')

const filteredTopics = computed(() => {
  if (!searchQuery.value) return topics.value

  const query = searchQuery.value.toLowerCase()
  return topics.value.filter(
    topic =>
      topic.name.toLowerCase().includes(query) ||
      topic.description?.toLowerCase().includes(query) ||
      topic.subtopics?.some(
        sub =>
          sub.name.toLowerCase().includes(query) || sub.description?.toLowerCase().includes(query)
      )
  )
})

onMounted(async () => {
  await fetchTopics()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-4">Temas Legales</h1>
        <p class="text-xl text-primary-100">
          Explore preguntas y respuestas por área legal o haga su propia consulta.
        </p>

        <!-- Search Bar -->
        <div class="mt-8 max-w-2xl">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar temas legales..."
            class="w-full px-4 py-3 rounded-lg pl-10 pr-4 bg-white text-gray-900"
          />
        </div>
      </div>
    </div>

    <!-- Topics Grid -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div v-if="isLoading" class="text-center py-12">
        <span class="text-gray-500">Cargando temas...</span>
      </div>

      <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700">
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="topic in filteredTopics"
          :key="topic.id"
          :to="`/questions/topics/${topic.slug}`"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
        >
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
            {{ topic.name }}
          </h3>
          <p class="mt-2 text-gray-600">{{ topic.description || 'No description available' }}</p>
          <div class="mt-4 flex items-center text-sm text-gray-500">
            <MessageCircle class="w-4 h-4 mr-1" />
            {{ (topic.questionsCount || 0).toLocaleString() }} preguntas
          </div>

          <!-- Subtopics if any -->
          <div v-if="topic.subtopics?.length" class="mt-4 space-y-2">
            <div
              v-for="subtopic in topic.subtopics"
              :key="subtopic.id"
              class="text-sm text-gray-600 hover:text-primary-600"
            >
              • {{ subtopic.name }}
              <span class="text-gray-400">({{ subtopic.questionsCount || 0 }})</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Ask Question CTA -->
    <div class="bg-primary-50 border-t">
      <div class="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">¿No encuentra lo que busca?</h2>
        <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
          Haga su consulta legal y reciba respuestas de abogados expertos de forma gratuita.
        </p>
        <NuxtLink
          to="/questions/ask"
          class="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
        >
          Hacer una Pregunta
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
