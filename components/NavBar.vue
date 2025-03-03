# Header.vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useLawyerAreas } from '~/composables/useLawyerAreas'
import type { PracticeArea } from '~/types/lawyer'
import { useNavigation } from '~/composables/useNavigation'
import { useLegalTopics } from '~/composables/useLegalTopics'
import AuthModal from '~/components/auth/Modal.vue'

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

const mainCategories = ['civil', 'family', 'labor', 'commercial']

const limitedGroupedAreas = computed(() => {
  return Object.fromEntries(
    Object.entries(groupedAreas.value).filter(([category]) => mainCategories.includes(category))
  )
})

const showAuthModal = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleLogin = (data: any) => {
  console.log('Login successful:', data)
  // Here you would typically:
  // 1. Store the user data in your auth store
  // 2. Set the authentication token
  // 3. Update the UI to show the logged-in state
}
</script>

<template>
  <header class="relative z-50">
    <!-- Top Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-2xl font-bold text-primary-700">Logo</NuxtLink>

            <div class="hidden md:flex space-x-6">
              <!-- Dropdown Menu -->
              <div ref="dropdownRef" class="relative">
                <button
                  class="inline-flex items-center text-gray-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  @click="isAreasMenuOpen = !isAreasMenuOpen"
                >
                  Abogados por Área
                  <ChevronDown
                    :class="{ 'rotate-180': isAreasMenuOpen }"
                    class="ml-1 w-4 h-4 transition-transform"
                  />
                </button>

                <!-- Dropdown Content -->
                <div
                  v-if="isAreasMenuOpen"
                  class="absolute left-0 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100"
                >
                  <div class="p-4">
                    <div
                      v-for="(areas, category) in limitedGroupedAreas"
                      :key="category"
                      class="mb-4"
                    >
                      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {{ categories[category as keyof typeof categories] }}
                      </h3>
                      <div class="space-y-1">
                        <NuxtLink
                          v-for="area in areas.slice(0, 3)"
                          :key="area.id"
                          :to="`/lawyers?area=${area.slug}`"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                          @click="isAreasMenuOpen = false"
                        >
                          {{ area.name }}
                        </NuxtLink>
                      </div>
                    </div>
                    <div class="border-t mt-4 pt-4">
                      <NuxtLink
                        to="/areas"
                        class="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors duration-200"
                        @click="isAreasMenuOpen = false"
                      >
                        Ver todas las áreas →
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Legal Topics Menu -->
              <LegalTopicsMenu />

              <GuidesMenu />
            </div>
          </div>

          <button
            class="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded text-sm font-medium transition-colors duration-200"
            @click="showAuthModal = true"
          >
            Iniciar Sesión
          </button>

          <AuthModal :show="showAuthModal" @close="showAuthModal = false" @login="handleLogin" />
        </div>
      </div>
    </nav>

    <!-- Secondary Navigation (for lawyer pages) -->
    <div v-if="route.path.includes('/lawyers')" class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center h-14">
          <template v-if="route.params.id">
            <NuxtLink
              to="/lawyers"
              class="text-primary-100 hover:text-white text-sm transition-colors duration-200"
            >
              Abogados
            </NuxtLink>
            <div v-if="bestArea">
              <NuxtLink
                :to="`/lawyers?area=${bestArea.slug}`"
                class="transition-colors duration-200"
              >
                <span class="mx-2 text-primary-300">›</span>
                <span class="text-white text-sm">{{ bestArea.name }}</span>
              </NuxtLink>
            </div>
            <span class="mx-2 text-primary-300">›</span>
            <span class="text-white text-sm">Perfil de Abogado</span>
          </template>
          <template v-else>
            <NuxtLink
              to="/lawyers"
              class="text-primary-100 hover:text-white text-sm transition-colors duration-200"
            >
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
          <NuxtLink
            to="/questions/topics"
            class="text-primary-100 hover:text-white text-sm transition-colors duration-200"
          >
            Preguntas Legales
          </NuxtLink>

          <template v-if="route.params.slug">
            <span class="mx-2 text-primary-300">›</span>
            <span class="text-white text-sm">{{ currentTopic?.name || 'Tema Legal' }}</span>
          </template>

          <template v-else-if="route.params.id">
            <span class="mx-2 text-primary-300">›</span>
            <span class="text-white text-sm">Pregunta Legal</span>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>
