<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, ThumbsUp, CheckCircle } from 'lucide-vue-next'
import { useReplies } from '~/composables/useReplies'
import { useAnswerActions } from '~/composables/useAnswerActions'
import { useAuth } from '~/composables/useAuth'
import type { Answer } from '~/types/question'

const props = defineProps<{
  answer: Answer
}>()

const showReplies = ref(false)
const showLoginPrompt = ref(false)
const { replies, isLoading: repliesLoading, fetchReplies } = useReplies()
const { toggleHelpful } = useAnswerActions()
const { isAuthenticated } = useAuth()

const handleToggleReplies = async () => {
  if (!showReplies.value && !replies.value.length) {
    await fetchReplies(props.answer.id)
  }
  showReplies.value = !showReplies.value
}

const handleToggleHelpful = async () => {
  // If not authenticated, show login prompt
  if (!isAuthenticated.value) {
    showLoginPrompt.value = true
    return
  }

  const result = await toggleHelpful(props.answer.id)
  if (result.success) {
    props.answer.helpfulCount += props.answer.isHelpful ? -1 : 1
    props.answer.isHelpful = !props.answer.isHelpful
  }
}

// Hide login prompt after 3 seconds
const hideLoginPrompt = () => {
  setTimeout(() => {
    showLoginPrompt.value = false
  }, 3000)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <!-- Answer Content -->
    <div class="prose max-w-none mb-6">
      <p>{{ answer.content }}</p>
    </div>

    <!-- Author Info -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <img
          v-if="answer.author.imageUrl"
          :src="answer.author.imageUrl"
          :alt="answer.author.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div
          v-else
          class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium"
        >
          {{ answer.author.name.charAt(0) }}
        </div>
        <div class="ml-3">
          <div class="flex items-center">
            <span class="font-medium text-gray-900">{{ answer.author.name }}</span>
            <span
              v-if="answer.author.isVerified"
              class="ml-2 inline-flex items-center text-sm text-green-600"
            >
              <CheckCircle class="w-4 h-4 mr-1" />
              Verificado
            </span>
          </div>
          <div class="text-sm text-gray-500">{{ answer.author.title }}</div>
          <div v-if="answer.author.reviewCount" class="text-sm text-gray-500">
            {{ answer.author.reviewCount }} reseñas
          </div>
        </div>
      </div>

      <!-- Helpful Button -->
      <div>
        <button
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm transition-colors"
          :class="[
            answer.isHelpful
              ? 'text-primary-600 border-primary-600 bg-primary-50'
              : isAuthenticated
                ? 'text-gray-700 border-gray-200 hover:bg-gray-50'
                : 'text-gray-400 border-gray-200 cursor-not-allowed'
          ]"
          @click="handleToggleHelpful"
        >
          <ThumbsUp class="w-4 h-4" :class="{ 'fill-current': answer.isHelpful }" />
          <span>Útil ({{ answer.helpfulCount }})</span>
        </button>

        <!-- Login prompt tooltip -->
        <div
          v-if="showLoginPrompt"
          class="mt-2 absolute bg-gray-800 text-white text-xs rounded py-1 px-2 right-8"
          @mouseenter="hideLoginPrompt"
        >
          Inicia sesión para marcar respuestas como útiles
        </div>
      </div>
    </div>

    <!-- Replies Section -->
    <div v-if="answer.replyCount > 0" class="border-t pt-4">
      <button
        class="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
        @click="handleToggleReplies"
      >
        <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showReplies }" />
        {{ showReplies ? 'Ocultar respuestas' : `Ver ${answer.replyCount} respuestas` }}
      </button>

      <!-- Replies List -->
      <div v-if="showReplies" class="mt-4 space-y-4">
        <div v-if="repliesLoading" class="text-center py-2">
          <span class="text-sm text-gray-500">Cargando respuestas...</span>
        </div>

        <div
          v-for="reply in replies"
          v-else
          :key="reply.id"
          class="pl-4 border-l-2 border-gray-100 py-2"
        >
          <div class="prose prose-sm max-w-none mb-2">
            <p>{{ reply.content }}</p>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center gap-2">
              <img
                v-if="reply.author.imageUrl"
                :src="reply.author.imageUrl"
                :alt="reply.author.name"
                class="w-6 h-6 rounded-full"
              />
              <span class="font-medium">{{ reply.author.name }}</span>
              <span v-if="reply.author.title" class="text-gray-400">
                · {{ reply.author.title }}
              </span>
            </div>
            <span>{{ formatDate(reply.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
