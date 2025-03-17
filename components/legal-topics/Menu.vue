<template>
  <div ref="dropdownRef" class="relative">
    <button
      class="inline-flex items-center text-gray-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
      @click="isOpen = !isOpen"
    >
      Preguntas Abiertas
      <ChevronDown :class="{ 'rotate-180': isOpen }" class="ml-1 w-4 h-4 transition-transform" />
    </button>

    <!-- Dropdown Menu - styled like areas menu -->
    <div
      v-if="isOpen"
      class="absolute left-0 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100"
    >
      <div v-if="isLoading" class="p-4 text-center">
        <div class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p class="text-sm text-gray-500">Cargando temas...</p>
      </div>
      
      <div v-else-if="error" class="p-4">
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>
      
      <div v-else class="p-4">
        <div v-if="topics.length === 0" class="text-center py-2">
          <p class="text-sm text-gray-500">No hay temas disponibles</p>
        </div>
        
        <template v-else>
          <div
            v-for="topic in topicsWithSubtopics.slice(0, 4)"
            :key="topic.id"
            class="mb-4"
          >
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {{ topic.name }}
            </h3>
            <div class="space-y-1">
              <NuxtLink
                :to="`/questions/topics/${topic.slug}`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                @click="isOpen = false"
              >
                Ver todo {{ topic.name }}
              </NuxtLink>
              <NuxtLink
                v-for="subtopic in (topic.subtopics || []).slice(0, 2)"
                :key="subtopic.id"
                :to="`/questions/topics/${subtopic.slug}`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                @click="isOpen = false"
              >
                {{ subtopic.name }}
              </NuxtLink>
            </div>
          </div>
        </template>
        
        <div class="border-t mt-4 pt-4">
          <NuxtLink
            to="/questions/topics"
            class="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors duration-200"
            @click="isOpen = false"
          >
            Ver todos los temas →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useLegalTopics } from '~/composables/useLegalTopics'

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const { topics, isLoading, error, fetchTopics } = useLegalTopics()

// Filter to only show topics with subtopics
const topicsWithSubtopics = computed(() => {
  return topics.value.filter(topic => 
    topic.subtopics && topic.subtopics.length > 0
  )
})

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})

onMounted(() => {
  fetchTopics()
})
</script>