<template>
    <div ref="dropdownRef" class="relative">
      <button
        class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center gap-1"
        @click="isOpen = !isOpen"
      >
        Preguntas Abiertas
        <ChevronDown
          :class="{ 'rotate-180': isOpen }"
          class="w-4 h-4 transition-transform"
        />
      </button>
  
      <!-- Dropdown Menu -->
      <div
        v-if="isOpen"
        class="absolute left-0 z-50 mt-2 w-[800px] bg-white rounded-md shadow-lg"
      >
        <div class="p-6">
          <!-- Topics Grid -->
          <div class="grid grid-cols-3 gap-x-8 gap-y-6">
            <div
              v-for="topic in topics"
              :key="topic.id"
              class="group"
            >
              <NuxtLink
                :to="`/questions/topics/${topic.slug}`"
                class="block font-medium text-gray-900 group-hover:text-primary-600"
              >
                {{ topic.name }}
              </NuxtLink>
              <p class="mt-1 text-sm text-gray-500 line-clamp-2">
                {{ topic.description }}
              </p>
              
              <!-- Subtopics -->
              <div v-if="topic.subtopics?.length" class="mt-2 space-y-1">
                <NuxtLink
                  v-for="subtopic in topic.subtopics.slice(0, 2)"
                  :key="subtopic.id"
                  :to="`/questions/topics/${topic.slug}/${subtopic.slug}`"
                  class="block text-sm text-gray-600 hover:text-primary-600"
                >
                  • {{ subtopic.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
            <NuxtLink
              to="/questions/topics"
              class="text-sm text-primary-600 hover:text-primary-800 inline-flex items-center"
            >
              Ver todos los temas
              <ChevronRight class="w-4 h-4 ml-1" />
            </NuxtLink>
            <NuxtLink
              to="/questions/ask"
              class="text-sm text-primary-600 hover:text-primary-800 inline-flex items-center"
            >
              Hacer una pregunta
              <ChevronRight class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ChevronDown, ChevronRight } from 'lucide-vue-next'
  import { onClickOutside } from '@vueuse/core'
  import { useLegalTopics } from '~/composables/useLegalTopics'
  
  const dropdownRef = ref<globalThis.HTMLElement | null>(null)
  const isOpen = ref(false)
  const { topics, fetchTopics } = useLegalTopics()
  
  onClickOutside(dropdownRef, () => {
    isOpen.value = false
  })
  
  onMounted(() => {
    fetchTopics()
  })
  </script>