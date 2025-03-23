<template>
  <div ref="dropdownRef" class="relative">
    <button
      class="inline-flex items-center text-gray-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
      @click="isOpen = !isOpen"
    >
      Guías Legales
      <ChevronDown :class="{ 'rotate-180': isOpen }" class="ml-1 w-4 h-4 transition-transform" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute left-0 z-50 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-100"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 text-center">
        <div
          class="inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"
        ></div>
        <p class="text-sm text-gray-500">Cargando guías...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4">
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>

      <!-- Content -->
      <div v-else class="p-4">
        <!-- No Categories Found -->
        <div v-if="!guideCategories || guideCategories.length === 0" class="text-center py-2">
          <p class="text-sm text-gray-500">No hay categorías disponibles</p>
        </div>

        <!-- Categories and Featured Guides -->
        <div v-else class="space-y-4">
          <div v-for="category in guideCategories" :key="category.id" class="mb-4">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {{ category.name }}
            </h3>
            <div class="space-y-1">
              <NuxtLink
                v-for="guide in category.featured_guides.slice(0, 3)"
                :key="guide.id"
                :to="`/guides/${guide.slug}`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                @click="isOpen = false"
              >
                {{ guide.title }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Footer Link -->
        <div class="border-t mt-4 pt-4">
          <NuxtLink
            to="/guides"
            class="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors duration-200 flex items-center"
            @click="isOpen = false"
          >
            Ver todas las guías
            <ChevronRight class="ml-1 w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useNavigationMenu } from '~/composables/useNavigationMenu'

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const { navigationMenu, isLoading, error, fetchNavigationMenu } = useNavigationMenu()

// Use both navigation menu and guide categories
const guideCategories = computed(() => {
  // If we have navigation menu data with guides, use that first
  if (navigationMenu.value?.guides && navigationMenu.value.guides.length > 0) {
    return navigationMenu.value.guides
  }
  
  // Otherwise, use guide categories if available
  return []
})

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})

onMounted(async () => {
  if (!navigationMenu.value) {
    await fetchNavigationMenu()
  }
})
</script>