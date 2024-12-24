<!-- components/NavBar.vue -->
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
                        to="/lawyers/areas"
                        class="text-sm text-primary-600 hover:text-primary-800 font-medium"
                        @click="isAreasMenuOpen = false"
                      >
                        Ver todas las áreas →
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>

              <NuxtLink
                to="/questions"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Preguntas Abiertas
              </NuxtLink>
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
          <NuxtLink to="/lawyers" class="text-primary-100 hover:text-white text-sm">
            Buscar Abogado
          </NuxtLink>
          <template v-if="currentArea">
            <span class="mx-2 text-primary-300">›</span>
            <span class="text-white text-sm">{{ currentArea.name }}</span>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useLawyerAreas } from '~/composables/useLawyerAreas'

const route = useRoute()
const { areas, groupedAreas, categories } = useLawyerAreas()
const isAreasMenuOpen = ref(false)
const dropdownRef = ref<globalThis.HTMLElement | null>(null)

onClickOutside(dropdownRef, () => {
  isAreasMenuOpen.value = false
})

const currentArea = computed(() => {
  const areaId = route.params.area
  return areas.find(area => area.id === areaId)
})
</script>
