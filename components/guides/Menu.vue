// components/guides/Menu.vue - Update the template section

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
      <div v-if="isLoading" class="p-4 text-center">
        <div
          class="inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"
        ></div>
        <p class="text-sm text-gray-500">Cargando guías...</p>
      </div>

      <div v-else-if="error" class="p-4">
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>

      <div v-else class="p-4">
        <div class="space-y-2">
          <NuxtLink
            v-for="guide in guides"
            :key="guide.id"
            :to="`/guides/${guide.slug}`"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
            @click="isOpen = false"
          >
            {{ guide.title }}
          </NuxtLink>
        </div>

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
import { ref, onMounted } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useGuides } from '~/composables/useGuides'

const dropdownRef = ref<globalThis.HTMLElement | null>(null)
const isOpen = ref(false)
const { guides, isLoading, error, fetchGuides } = useGuides()

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})

onMounted(async () => {
  if (guides.value.length === 0) {
    await fetchGuides()
  }
})
</script>
