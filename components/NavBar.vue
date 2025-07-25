<template>
  <header class="relative z-50">
    <!-- Top Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center justify-center min-w-[120px]">
              <img src="/lexic-logo.png" alt="Lexic - Asesoría Legal" class="h-10 w-auto" />
            </NuxtLink>
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
                <div v-if="navIsLoading" class="p-4 text-center">
                  <div
                    class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"
                  ></div>
                  <p class="text-sm text-gray-500">Cargando áreas...</p>
                </div>

                <div v-else-if="navError" class="p-4">
                  <p class="text-sm text-red-500">{{ navError }}</p>
                </div>

                <div v-else class="p-4">
                  <div
                    v-if="!navigationMenu?.areas || navigationMenu.areas.length === 0"
                    class="text-center py-2"
                  >
                    <p class="text-sm text-gray-500">No hay áreas disponibles</p>
                  </div>

                  <template v-else>
                    <div v-for="category in navigationMenu.areas" :key="category.id" class="mb-4">
                      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {{ category.name }}
                      </h3>
                      <div class="space-y-1">
                        <NuxtLink
                          v-for="area in category.featured_areas"
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
                <div v-if="navIsLoading" class="p-4 text-center">
                  <div
                    class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"
                  ></div>
                  <p class="text-sm text-gray-500">Cargando temas...</p>
                </div>

                <div v-else-if="navError" class="p-4">
                  <p class="text-sm text-red-500">{{ navError }}</p>
                </div>

                <div v-else class="p-4">
                  <div
                    v-if="!navigationMenu?.topics || navigationMenu.topics.length === 0"
                    class="text-center py-2"
                  >
                    <p class="text-sm text-gray-500">No hay temas disponibles</p>
                  </div>

                  <template v-else>
                    <div
                      v-for="topic in navigationMenu.topics.slice(0, 4)"
                      :key="topic.id"
                      class="mb-4"
                    >
                      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {{ topic.name }}
                      </h3>
                      <div class="space-y-1">
                        <NuxtLink
                          v-for="subtopic in topic.featured_subtopics"
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

            <!-- Guides Menu - Now using the GuidesMenu component -->
            <GuidesMenu />

            <!-- FAQ Link -->
            <NuxtLink
              to="/faq"
              class="text-gray-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              FAQ
            </NuxtLink>
          </div>

          <div class="flex items-center">
            <!-- Lawyer Dashboard Button -->
            <a
              v-if="isAuthenticated && user?.isLawyer"
              :href="getLawyerDashboardUrl()"
              target="_blank"
              class="mr-3 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
            >
              Panel de Abogado
            </a>

            <!-- Add the notification bell only for authenticated users -->
            <div v-if="isAuthenticated" class="mr-4">
              <CommonNotificationBell />
            </div>

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
                <div v-else ref="userMenuRef" class="relative">
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
                      <NuxtLink
                        to="/messages"
                        class="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200 flex items-center justify-between"
                        @click="isUserMenuOpen = false"
                      >
                        <span>Mis Mensajes</span>
                        <span
                          v-if="hasUnreadMessages"
                          class="bg-primary-600 text-white text-xs rounded-full px-1.5 min-w-[1.25rem] text-center"
                        >
                          {{ unreadCount }}
                        </span>
                      </NuxtLink>
                      <NuxtLink
                        to="/reviews"
                        class="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                        @click="isUserMenuOpen = false"
                      >
                        Mis Reseñas
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

            <!-- Mobile menu button -->
            <button
              class="ml-4 md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
              @click="toggleMobileMenu"
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
          <button class="text-gray-500 hover:text-gray-700" @click="isMobileMenuOpen = false">
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
              <div
                v-for="category in navigationMenu?.areas.slice(0, 3) || []"
                :key="category.id"
                class="py-2"
              >
                <div class="font-medium text-gray-800">{{ category.name }}</div>
                <div class="pl-3 space-y-2 mt-1">
                  <NuxtLink
                    v-for="area in category.featured_areas"
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
              <div
                v-for="topic in navigationMenu?.topics.slice(0, 3) || []"
                :key="topic.id"
                class="pb-2"
              >
                <div class="py-1 font-medium text-gray-800">{{ topic.name }}</div>
                <div
                  v-if="topic.featured_subtopics && topic.featured_subtopics.length > 0"
                  class="pl-3 space-y-2"
                >
                  <NuxtLink
                    v-for="subtopic in topic.featured_subtopics.slice(0, 2)"
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
              <div
                v-for="category in navigationMenu?.guides.slice(0, 3) || []"
                :key="category.id"
                class="py-2"
              >
                <div class="font-medium text-gray-800">{{ category.name }}</div>
                <div class="pl-3 space-y-2 mt-1">
                  <NuxtLink
                    v-for="guide in category.featured_guides.slice(0, 2)"
                    :key="guide.id"
                    :to="`/guides/${guide.slug}`"
                    class="block py-1 text-sm text-gray-600 hover:text-primary-600"
                    @click="isMobileMenuOpen = false"
                  >
                    {{ guide.title }}
                  </NuxtLink>
                </div>
              </div>

              <NuxtLink
                to="/guides"
                class="block py-2 text-sm text-primary-600 hover:text-primary-800 font-medium mt-3"
                @click="isMobileMenuOpen = false"
              >
                Ver todas las guías →
              </NuxtLink>
            </div>
          </div>

          <!-- FAQ Link -->
          <NuxtLink
            to="/faq"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
            @click="isMobileMenuOpen = false"
          >
            Preguntas Frecuentes
          </NuxtLink>

          <!-- About Link -->
          <NuxtLink
            to="/about"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
            @click="isMobileMenuOpen = false"
          >
            Acerca de Nosotros
          </NuxtLink>
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
import { ChevronDown, Menu, X } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useLawyerAreas } from '~/composables/useLawyerAreas'
import type { PracticeArea } from '~/types/lawyer'
import { useNavigation } from '~/composables/useNavigation'
import { useAuth } from '~/composables/useAuth'
import { useNavigationMenu } from '~/composables/useNavigationMenu'
import AuthModal from '~/components/auth/Modal.vue'
import GuidesMenu from '~/components/guides/Menu.vue'
import { useUnreadMessages } from '~/composables/useUnreadMessages'
import { useConfig } from '~/composables/useConfig'
import { createLawyerPanelLink } from '~/utils/auth-transfer'

const config = useConfig()
const { unreadCount, hasUnreadMessages } = useUnreadMessages()

const route = useRoute()
const { currentLawyer } = useNavigation()
const { areas } = useLawyerAreas()

// Use the new navigation menu
const {
  navigationMenu,
  isLoading: navIsLoading,
  error: navError,
  fetchNavigationMenu
} = useNavigationMenu()

const { user, isAuthenticated, logout } = useAuth()

// State to track full initialization
const isFullyInitialized = ref(false)

// Auth state and modals
const showAuthModal = ref(false)
const isAreasMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const isLegalTopicsOpen = ref(false)
const dropdownRef = ref<Element | null>(null)
const userMenuRef = ref<Element | null>(null)
const legalTopicsRef = ref<Element | null>(null)

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

  // First try to find in navigationMenu
  if (navigationMenu.value && navigationMenu.value.topics) {
    for (const topic of navigationMenu.value.topics) {
      if (topic.slug === route.params.slug) {
        return topic
      }

      if (topic.featured_subtopics) {
        const subtopic = topic.featured_subtopics.find(st => st.slug === route.params.slug)
        if (subtopic) return subtopic
      }
    }
  }

  return null
})

const bestArea = computed(() =>
  currentLawyer.value?.areas.find((x: PracticeArea) => Math.max(x.experienceScore))
)

// Function to get the dashboard URL with auth token
const getLawyerDashboardUrl = () => {
  // Use the createLawyerPanelLink function to generate a URL with auth token
  return createLawyerPanelLink(config.public.lawyerDashboardUrl)
}

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

// Handle login success
const handleLogin = (data: unknown) => {
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
  if (import.meta.client) {
    if (isMobileMenuOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
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

// Initialize auth state and navigation menu on page load
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

  // Fetch navigation menu for dropdowns
  await fetchNavigationMenu()
})

// Close mobile menu when route changes
watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
    mobileSubmenu.value = null
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  }
)

// Clean up when component is unmounted
onUnmounted(() => {
  // Restore body scrolling
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>
