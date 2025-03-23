<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-primary-800 text-white">
        <div class="max-w-7xl mx-auto px-4 py-12">
          <h1 class="text-3xl font-bold mb-4">Categorías de Guías Legales</h1>
          <p class="text-xl text-primary-100 mb-6">
            Encuentra recursos legales organizados por tema
          </p>
        </div>
      </div>
  
      <!-- Categories Grid -->
      <div class="max-w-7xl mx-auto px-4 py-12">
        <!-- Loading State -->
        <div v-if="isLoading">
          <CommonLoading message="Cargando categorías..." />
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="mb-6">
          <CommonErrorMessage :message="error" />
        </div>
  
        <!-- Empty State -->
        <div v-else-if="categories.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
          <p class="text-gray-500 mb-4">No se encontraron categorías.</p>
          <NuxtLink
            to="/guides"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todas las guías
          </NuxtLink>
        </div>
  
        <!-- Categories List -->
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="`/guides/categories/${category.slug}`"
              class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
            >
              <!-- Visual indicator of category - Icon or color -->
              <div class="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <FileText class="w-6 h-6" />
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-3">
                {{ category.name }}
              </h3>
              
              <!-- Show guide count -->
              <div class="flex items-center text-sm text-gray-500">
                <BookOpen class="w-4 h-4 mr-1" />
                {{ category.guide_count }} {{ category.guide_count === 1 ? 'guía' : 'guías' }}
              </div>
              
              <div class="mt-4 flex items-center text-sm text-primary-600">
                <span>Explorar categoría</span>
                <ChevronRight class="w-4 h-4 ml-1" />
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  import { FileText, BookOpen, ChevronRight } from 'lucide-vue-next'
  import { useGuideCategories } from '~/composables/useGuideCategories'
  
  // Categories data
  const { categories, isLoading, error, fetchCategories } = useGuideCategories()
  
  onMounted(async () => {
    await fetchCategories()
  })
  </script>