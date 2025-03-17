<template>
  <header class="relative z-50">
    <!-- Top Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-primary-700">Logo</NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex space-x-6 items-center">
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
                  <div
                    class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"
                  ></div>
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
                    <div v-for="categoryId in mainCategoryIds" :key="categoryId" class="mb-4">
                      <h3
                        v-if="categoriesData[categoryId]"
                        class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                      >
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
            <div ref="legalTopicsRef" class="relative">
              <button
                class="inline-flex items-center text-gray-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
                @click="isLegalTopicsOpen = !isLegalTopicsOpen"
              >
                Preguntas Abiertas
                <ChevronDown
                  :class="{ 'rotate-180': isLegalTopicsOpen }"
                  class="ml-1 w-4 h-4 transition-transform"
                />
              </button>

              <!-- Dropdown Content - Consistent with other menus -->
              <div
                v-if="isLegalTopicsOpen"
                class="absolute left-0 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100"
              >
                <div v-if="isTopicsLoading" class="p-4 text-center">
                  <div
                    class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"
                  ></div>
                  <p class="text-sm text-gray-500">Cargando temas...</p>
                </div>

                <div v-else-if="topicsError" class="p-4">
                  <p class="text-sm text-red-500">{{ topicsError }}</p>
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
                          @click="isLegalTopicsOpen = false"
                        >
                          Ver todo {{ topic.name }}
                        </NuxtLink>
                        <NuxtLink
                          v-for="subtopic in (topic.subtopics || []).slice(0, 2)"
                          :key="subtopic.id"
                          :to="`/questions/topics/${subtopic.slug}`"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                          @click="isLegalTopicsOpen = false"
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
                      @click="isLegalTopicsOpen = false"
                    >
                      Ver todos los temas →
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Guides Menu -->
            <GuidesMenu />
          </div>

          <div class="flex items-center">
            <!-- Auth Section - Improved with smoother state transition -->
            <div>
              <template v-if="!isFullyInitialized">
                <!-- Show loading spinner during initialization -->
                <div class="flex items-center justify-center w-10 h-10">
                  <div
                    class="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                </div>
              </template>

              <template v-else>
                <!-- Show login button if not authenticated -->
                <button
                  v-if="!isAuthenticated"
                  class="bg-accent hover:bg-accent-hover text-white px-4 md:px-6 py-2 rounded text-sm font-medium transition-colors duration-200"
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
                    <span class="hidden md:inline mr-1">{{ user?.firstName || 'Usuario' }}</span>
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
              </template>
            </div>

            <!-- Mobile menu button - moved to the right -->
            <button
              @click="toggleMobileMenu"
              class="ml-4 md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
              <X v-else class="w-6 h-6" />
            </button>
          </div>

          <AuthModal :show="showAuthModal" @close="showAuthModal = false" @login="handleLogin" />
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <div v-show="isMobileMenuOpen" class="md:hidden fixed inset-0 z-50">
      <!-- Menu panel -->
      <div class="bg-white h-full w-full overflow-y-auto flex flex-col">
        <!-- Header with close button -->
        <div class="p-4 border-b flex justify-between items-center">
          <span class="font-medium">Menú</span>
          <button @click="isMobileMenuOpen = false" class="text-gray-500 hover:text-gray-700">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Menu items -->
        <div class="flex-1 p-4 space-y-4">
          <!-- Lawyers link -->
          <NuxtLink
            to="/lawyers"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
            @click="isMobileMenuOpen = false"
          >
            Abogados
          </NuxtLink>

          <!-- Areas section -->
          <div class="px-3 py-2">
            <div
              class="flex justify-between items-center text-gray-700 hover:text-primary-600 cursor-pointer"
              @click="toggleMobileSubmenu('areas')"
            >
              <span class="text-base font-medium">Áreas de Práctica</span>
              <ChevronDown
                :class="{ 'rotate-180': mobileSubmenu === 'areas' }"
                class="w-5 h-5 transition-transform"
              />
            </div>

            <!-- Mobile areas submenu -->
            <div v-if="mobileSubmenu === 'areas'" class="mt-2 pl-4 space-y-2">
              <div v-for="category in Object.keys(categoriesData).slice(0, 3)" :key="category" class="py-2">
                <div class="font-medium text-gray-800">{{ categoriesData[category]?.name }}</div>
                <div class="pl-3 space-y-2 mt-1">
                  <NuxtLink
                    v-for="area in (groupedAreas[category] || []).slice(0, 3)"
                    :key="area.id"
                    :to="`/lawyers?area=${area.slug}`"
                    class="block py-1 text-sm text-gray-600 hover:text-primary-600"
                    @click="isMobileMenuOpen = false"
                  >
                    {{ area.name }}
                  </NuxtLink>
                </div>
              </div>
              <NuxtLink
                to="/areas"
                class="block py-2 text-sm text-primary-600 hover:text-primary-800 font-medium mt-3"
                @click="isMobileMenuOpen = false"
              >
                Ver todas las áreas →
              </NuxtLink>
            </div>
          </div>

          <!-- Legal Topics section -->
          <div class="px-3 py-2">
            <div
              class="flex justify-between items-center text-gray-700 hover:text-primary-600 cursor-pointer"
              @click="toggleMobileSubmenu('topics')"
            >
              <span class="text-base font-medium">Preguntas Legales</span>
              <ChevronDown
                :class="{ 'rotate-180': mobileSubmenu === 'topics' }"
                class="w-5 h-5 transition-transform"
              />
            </div>

            <!-- Mobile topics submenu -->
            <div v-if="mobileSubmenu === 'topics'" class="mt-2 pl-4 space-y-3">
              <div v-for="topic in topicsWithSubtopics.slice(0, 3)" :key="topic.id" class="pb-2">
                <div class="py-1 font-medium text-gray-800">{{ topic.name }}</div>
                <div v-if="topic.subtopics && topic.subtopics.length > 0" class="pl-3 space-y-2">
                  <NuxtLink
                    v-for="subtopic in topic.subtopics.slice(0, 2)"
                    :key="subtopic.id"
                    :to="`/questions/topics/${subtopic.slug}`"
                    class="block py-1 text-sm text-gray-600 hover:text-primary-600"
                    @click="isMobileMenuOpen = false"
                  >
                    {{ subtopic.name }}
                  </NuxtLink>
                </div>
              </div>
              
              <!-- Highlighted 'Hacer una pregunta' link -->
              <NuxtLink
                to="/questions/ask"
                class="block py-2 text-sm bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md px-3 font-medium"
                @click="isMobileMenuOpen = false"
              >
                Hacer una pregunta
              </NuxtLink>
              
              <NuxtLink
                to="/questions/topics"
                class="block py-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                @click="isMobileMenuOpen = false"
              >
                Ver todos los temas →
              </NuxtLink>
            </div>
          </div>

          <!-- Guides section -->
          <div class="px-3 py-2">
            <div
              class="flex justify-between items-center text-gray-700 hover:text-primary-600 cursor-pointer"
              @click="toggleMobileSubmenu('guides')"
            >
              <span class="text-base font-medium">Guías Legales</span>
              <ChevronDown
                :class="{ 'rotate-180': mobileSubmenu === 'guides' }"
                class="w-5 h-5 transition-transform"
              />
            </div>

            <!-- Mobile guides submenu -->
            <div v-if="mobileSubmenu === 'guides'" class="mt-2 pl-4 space-y-2">
              <NuxtLink
                to="/guides/posesion-efectiva-chile"
                class="block py-2 text-sm text-gray-600 hover:text-primary-600"
                @click="isMobileMenuOpen = false"
              >
                Posesión Efectiva
              </NuxtLink>
              <NuxtLink
                to="/guides"
                class="block py-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                @click="isMobileMenuOpen = false"
              >
                Ver todas las guías →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Navigation (for lawyer pages) - Unchanged -->
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

    <!-- Secondary Navigation (for questions pages) - Unchanged -->
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-vue-next'
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

const { topics, isLoading: isTopicsLoading, error: topicsError, fetchTopics } = useLegalTopics()
const { user, isAuthenticated, logout, authLoading } = useAuth()

// State to track full initialization
const isFullyInitialized = ref(false)

// Auth state and modals
const showAuthModal = ref(false)
const isAreasMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const isLegalTopicsOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const userMenuRef = ref<HTMLElement | null>(null)
const legalTopicsRef = ref<HTMLElement | null>(null)

// Mobile navigation state
const isMobileMenuOpen = ref(false)
const mobileSubmenu = ref<string | null>(null)

// User initials for avatar
const userInitials = computed(() => {
  if (!user.value) return '?'

  const firstName = user.value.firstName || ''
  const lastName = user.value.lastName || ''

  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()

  return firstInitial + (lastInitial || '')
})

// Current area and topic from route
const currentArea = computed(() => {
  const slug = route.query.area
  return areas.value.find(area => area.slug === slug)
})

const currentTopic = computed(() => {
  if (!route.params.slug) return null

  return (
    topics.value.find(t => t.slug === route.params.slug) ||
    topics.value.flatMap(t => t.subtopics || []).find(st => st.slug === route.params.slug)
  )
})

// Filter to only show topics with subtopics
const topicsWithSubtopics = computed(() => {
  return topics.value.filter(topic => 
    topic.subtopics && topic.subtopics.length > 0
  )
})

const bestArea = computed(() =>
  currentLawyer.value?.areas.find((x: PracticeArea) => Math.max(x.experienceScore))
)

// Close dropdowns when clicking outside
onClickOutside(dropdownRef, () => {
  isAreasMenuOpen.value = false
})

onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false
})

onClickOutside(legalTopicsRef, () => {
  isLegalTopicsOpen.value = false
})

// Get top categories by number of areas
const mainCategoryIds = computed(() => {
  // Get categories that have areas
  const categoriesWithAreas = Object.keys(groupedAreas.value).filter(
    categoryId => groupedAreas.value[categoryId]?.length > 0
  )

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
  // Close mobile menu if open
  isMobileMenuOpen.value = false
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  
  // When closing the menu, also close any open submenu
  if (!isMobileMenuOpen.value) {
    mobileSubmenu.value = null
  }
  
  // Prevent body scrolling when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Toggle mobile submenu
const toggleMobileSubmenu = (menu: string) => {
  if (mobileSubmenu.value === menu) {
    mobileSubmenu.value = null
  } else {
    mobileSubmenu.value = menu
  }
}

// Initialize auth state on page load
onMounted(async () => {
  const { initAuth } = useAuth()
  
  // Set a minimum loading time of 300ms to avoid flickering
  const loadingStart = Date.now()
  
  // Initialize auth state
  await initAuth()
  
  // Calculate how much time has passed
  const timeElapsed = Date.now() - loadingStart
  
  // If less than 300ms has passed, wait the remaining time
  if (timeElapsed < 300) {
    await new Promise(resolve => setTimeout(resolve, 300 - timeElapsed))
  }
  
  // Mark initialization as complete
  isFullyInitialized.value = true
  
  // Fetch topics for the legal topics dropdown
  fetchTopics()
})

// Close mobile menu when route changes
watch(() => route.fullPath, () => {
  isMobileMenuOpen.value = false
  mobileSubmenu.value = null
  document.body.style.overflow = ''
})

// Clean up when component is unmounted
onUnmounted(() => {
  // Restore body scrolling
  document.body.style.overflow = ''
})
</script>