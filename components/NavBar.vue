<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useLawyerAreas } from '~/composables/useLawyerAreas'
import type { PracticeArea } from '~/types/lawyer'
import { useNavigation } from '~/composables/useNavigation'
import { useLegalTopics } from '~/composables/useLegalTopics'

const route = useRoute()
const { currentLawyer } = useNavigation()
const { areas, groupedAreas, categories } = useLawyerAreas()
const { topics } = useLegalTopics()
const isAreasMenuOpen = ref(false)
const dropdownRef = ref<globalThis.HTMLElement | null>(null)

const currentTopic = computed(() => {
  if (!route.params.slug) return null

  return (
    topics.value.find(t => t.slug === route.params.slug) ||
    topics.value.flatMap(t => t.subtopics || []).find(st => st.slug === route.params.slug)
  )
})

onClickOutside(dropdownRef, () => {
  isAreasMenuOpen.value = false
})

const currentArea = computed(() => {
  const slug = route.query.area
  return areas.find(area => area.slug === slug)
})

const bestArea = computed(() =>
  currentLawyer.value?.areas.find((x: PracticeArea) => Math.max(x.experienceScore))
)
</script>

<template>
  <header>
    <!-- Top Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">Logo</NuxtLink>
            <div class="hidden md:flex ml-10 space-x-8">
              <!-- Dropdown Menu -->
              <div ref="dropdownRef" class="relative">
                <button
                  class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center gap-1"
                  @click="isAreasMenuOpen = !isAreasMenuOpen"
                >
                  Abogados por Área
                  <ChevronDown
                    :class="{ 'rotate-180': isAreasMenuOpen }"
                    class="w-4 h-4 transition-transform"
                  />
                </button>

                <!-- Dropdown Content -->
                <div
                  v-if="isAreasMenuOpen"
                  class="absolute left-0 z-50 mt-2 w-80 bg-white rounded-md shadow-lg"
                >
                  <div class="p-4">
                    <div v-for="(areas, category) in groupedAreas" :key="category" class="mb-4">
                      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {{ categories[category] }}
                      </h3>
                      <div class="space-y-1">
                        <NuxtLink
                          v-for="area in areas.slice(0, 3)"
                          :key="area.id"
                          :to="`/lawyers?area=${area.slug}`"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          @click="isAreasMenuOpen = false"
                        >
                          {{ area.name }}
                        </NuxtLink>
                      </div>
                    </div>
                    <div class="border-t mt-4 pt-4">
                      <NuxtLink
                        to="/areas"
                        class="text-sm text-primary-600 hover:text-primary-800 font-medium"
                        @click="isAreasMenuOpen = false"
                      >
                        Ver todas las áreas →
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Legal Topics Dropdown -->
              <LegalTopicsMenu />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/profile/create"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Crear Perfil
            </NuxtLink>
            <button
              class="bg-accent-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-accent-700"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Secondary Navigation (only for lawyer pages) -->
    <div v-if="route.path.includes('/lawyers')" class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center h-14">
          <template v-if="route.params.id">
            <!-- Lawyer Profile Page -->
            <NuxtLink to="/lawyers" class="text-primary-100 hover:text-white text-sm">
              Abogados
            </NuxtLink>
            <div v-if="bestArea">
              <NuxtLink :to="`/lawyers?area=${bestArea.slug}`">
                <span class="mx-2 text-primary-300">›</span>
                <span class="text-white text-sm">{{ bestArea.name }}</span>
              </NuxtLink>
            </div>
            <span class="mx-2 text-primary-300">›</span>
            <span class="text-white text-sm">Perfil de Abogado</span>
          </template>
          <template v-else>
            <!-- Lawyer List Page -->
            <NuxtLink to="/lawyers" class="text-primary-100 hover:text-white text-sm">
              Abogados
            </NuxtLink>
            <template v-if="currentArea">
              <span class="mx-2 text-primary-300">›</span>
              <span class="text-white text-sm">{{ currentArea.name }}</span>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- Secondary Navigation (for questions pages) -->
    <div v-if="route.path.includes('/questions')" class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center h-14">
          <NuxtLink to="/questions/topics" class="text-primary-100 hover:text-white text-sm">
            Preguntas Legales
          </NuxtLink>

          <template v-if="route.params.slug">
            <!-- For topic pages -->
            <span class="mx-2 text-primary-300">›</span>
            <span class="text-white text-sm">{{ currentTopic?.name || 'Tema Legal' }}</span>
          </template>

          <template v-else-if="route.params.id">
            <!-- For individual question pages -->
            <span class="mx-2 text-primary-300">›</span>
            <span class="text-white text-sm">Pregunta Legal</span>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>
