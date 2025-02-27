<!-- components/guides/Menu.vue -->
<template>
    <div ref="dropdownRef" class="relative">
      <button
        class="inline-flex items-center text-gray-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
        @click="isOpen = !isOpen"
      >
        Guías
        <ChevronDown :class="{ 'rotate-180': isOpen }" class="ml-1 w-4 h-4 transition-transform" />
      </button>
  
      <!-- Dropdown Menu -->
      <div v-if="isOpen" class="absolute left-0 z-50 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-100">
        <div class="p-4">
          <div class="space-y-2">
            <NuxtLink
              to="/guides/posesion-efectiva-chile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
              @click="isOpen = false"
            >
              Posesión Efectiva en Chile
            </NuxtLink>
            <!-- Add more guides here as needed -->
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
  import { ref } from 'vue'
  import { ChevronDown, ChevronRight } from 'lucide-vue-next'
  import { onClickOutside } from '@vueuse/core'
  
  const dropdownRef = ref<globalThis.HTMLElement | null>(null)
  const isOpen = ref(false)
  
  onClickOutside(dropdownRef, () => {
    isOpen.value = false
  })
  </script>