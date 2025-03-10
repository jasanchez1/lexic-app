<template>
  <header class="relative z-50">
    <!-- Top Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-2xl font-bold text-primary-700">Logo</NuxtLink>

            <div class="hidden md:flex space-x-6">
              <!-- Areas Dropdown Menu -->
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
                  <div v-if="isAreasLoading" class="p-4 text-center">
                    <div class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p class="text-sm text-gray-500">Cargando áreas...</p>
                  </div>
                  
                  <div v-else-if="areasError" class="p-4">
                    <p class="text-sm text-red-500">{{ areasError }}</p>
                  </div>
                  
                  <div v-else class="p-4">
                    <div v-if="Object.keys(groupedAreas).length === 0" class="text-center py-2">
                      <p class="text-sm text-gray-500">No hay áreas disponibles</p>
                    </div>
                    
                    <template v-else>
                      <div
                        v-for="categoryId in mainCategoryIds"
                        :key="categoryId"
                        class="mb-4"
                      >
                        <h3 v-if="categoriesData[categoryId]" class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          {{ categoriesData[categoryId].name }}
                        </h3>
                        <div class="space-y-1">
                          <NuxtLink
                            v-for="area in groupedAreas[categoryId]?.slice(0, 3) || []"
                            :key="area.id"
                            :to="`/lawyers?area=${area.slug}`"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                            @click="isAreasMenuOpen = false"
                          >
                            {{ area.name }}
                          </NuxtLink>
                        </div>
                      </div>
                    </template>
                    
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

          <!-- Auth Section -->
          <div>
            <!-- Show login button if not authenticated -->
            <button
              v-if="!isAuthenticated"
              class="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded text-sm font-medium transition-colors duration-200"
              @click="showAuthModal = true"
            >
              Iniciar Sesión
            </button>

            <!-- Show user dropdown if authenticated -->
            <div v-else class="relative" ref="userMenuRef">
              <button
                class="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
                @click="isUserMenuOpen = !isUserMenuOpen"
              >
                <div
                  class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2"
                >
                  {{ userInitials }}
                </div>
                <span class="mr-1">{{ user?.first_name || 'Usuario' }}</span>
                <ChevronDown
                  :class="{ 'rotate-180': isUserMenuOpen }"
                  class="w-4 h-4 transition-transform"
                />
              </button>

              <!-- User Dropdown Menu -->
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-50"
              >
                <div class="p-2">
                  <div class="border-b pb-2 mb-2 px-3 py-2">
                    <p class="text-sm font-medium">{{ user?.email }}</p>
                  </div>
                  <NuxtLink
                    to="/profile"
                    class="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                    @click="isUserMenuOpen = false"
                  >
                    Mi Perfil
                  </NuxtLink>
                  <button
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                    @click="handleLogout"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useLawyerAreas } from '~/composables/useLawyerAreas'
import type { PracticeArea } from '~/types/lawyer'
import { useNavigation } from '~/composables/useNavigation'
import { useLegalTopics } from '~/composables/useLegalTopics'
import { useAuth } from '~/composables/useAuth'
import AuthModal from '~/components/auth/Modal.vue'

const route = useRoute()
const { currentLawyer } = useNavigation()
const { 
  areas, 
  categoriesData, 
  groupedAreas, 
  isLoading: isAreasLoading, 
  error: areasError 
} = useLawyerAreas()

const { topics } = useLegalTopics()
const { user, isAuthenticated, logout } = useAuth()

// Auth state and modals
const showAuthModal = ref(false)
const isAreasMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const userMenuRef = ref<HTMLElement | null>(null)

// User initials for avatar
const userInitials = computed(() => {
  if (!user.value) return '?'

  const firstName = user.value.first_name || ''
  const lastName = user.value.last_name || ''

  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()

  return firstInitial + (lastInitial || '')
})

const currentTopic = computed(() => {
  if (!route.params.slug) return null

  return (
    topics.value.find(t => t.slug === route.params.slug) ||
    topics.value.flatMap(t => t.subtopics || []).find(st => st.slug === route.params.slug)
  )
})

// Close dropdowns when clicking outside
onClickOutside(dropdownRef, () => {
  isAreasMenuOpen.value = false
})

onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false
})

const currentArea = computed(() => {
  const slug = route.query.area
  return areas.value.find(area => area.slug === slug)
})

const bestArea = computed(() =>
  currentLawyer.value?.areas.find((x: PracticeArea) => Math.max(x.experienceScore))
)

// Get top categories by number of areas
const mainCategoryIds = computed(() => {
  // Get categories that have areas
  const categoriesWithAreas = Object.keys(groupedAreas.value)
    .filter(categoryId => groupedAreas.value[categoryId]?.length > 0)
  
  // Sort by number of areas (descending)
  categoriesWithAreas.sort((a, b) => {
    const aCount = groupedAreas.value[a]?.length || 0
    const bCount = groupedAreas.value[b]?.length || 0
    return bCount - aCount
  })
  
  // Take top 4 categories
  return categoriesWithAreas.slice(0, 4)
})

// Handle login success
const handleLogin = (data: any) => {
  console.log('Login successful:', data)
  showAuthModal.value = false
}

// Handle logout
const handleLogout = async () => {
  await logout()
  isUserMenuOpen.value = false
}

// Initialize auth state on page load
onMounted(async () => {
  const { initAuth } = useAuth()
  await initAuth()
})
</script>