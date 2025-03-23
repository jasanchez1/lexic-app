<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-4">Guías Legales</h1>
        <p class="text-xl text-primary-100 mb-6">
          Recursos completos y detallados sobre temas legales relevantes en Chile
        </p>
        <p class="text-primary-100 max-w-4xl">
          En este espacio, ponemos a tu disposición una amplia variedad de artículos legales
          diseñados para hacer que el conocimiento jurídico sea accesible para todos. Nuestro
          objetivo es brindarte información clara y útil sobre tus derechos y obligaciones, así como
          mantenerte al día con las últimas novedades legales.
        </p>
      </div>
    </div>

    <!-- Category Cards -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">Categorías</h2>
      
      <!-- Loading State -->
      <div v-if="categoriesLoading">
        <CommonLoading message="Cargando categorías..." />
      </div>
      
      <!-- Error State -->
      <div v-else-if="categoriesError" class="mb-6">
        <CommonErrorMessage :message="categoriesError" />
      </div>
      
      <!-- Categories Grid -->
      <div v-else-if="categories.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="setCategory(category.slug)"
          class="bg-white rounded-lg border p-4 text-center flex flex-col items-center justify-center transition-all"
          :class="selectedCategory === category.slug ? 'border-primary-500 shadow-md ring-2 ring-primary-100' : 'hover:shadow-md border-gray-200'"
        >
          <!-- Category Icon (tailored to the category name) -->
          <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-3">
            <FileText v-if="category.slug === 'civil'" class="w-8 h-8 text-primary-500" />
            <Building v-else-if="category.slug === 'inmobiliario'" class="w-8 h-8 text-primary-500" />
            <Briefcase v-else-if="category.slug === 'laboral'" class="w-8 h-8 text-primary-500" />
            <ScrollText v-else-if="category.slug === 'legal'" class="w-8 h-8 text-primary-500" />
            <Users v-else-if="category.slug === 'sucesiones'" class="w-8 h-8 text-primary-500" />
            <BookOpen v-else class="w-8 h-8 text-primary-500" />
          </div>
          
          <!-- Category Name -->
          <h3 
            class="font-medium mb-1"
            :class="selectedCategory === category.slug ? 'text-primary-700' : 'text-gray-900'"
          >
            {{ category.name }}
          </h3>
          
          <!-- Guide Count -->
          <p class="text-sm text-gray-500">
            {{ category.guide_count }} {{ category.guide_count === 1 ? 'guía' : 'guías' }}
          </p>
        </button>
        
        <!-- "Show All" card -->
        <button
          v-if="selectedCategory"
          @click="selectedCategory = ''; resetCategory();"
          class="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 text-center flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <BookOpen class="w-8 h-8 text-gray-500" />
          </div>
          <h3 class="font-medium text-gray-700 mb-1">Ver Todas</h3>
          <p class="text-sm text-gray-500">Todas las guías</p>
        </button>
      </div>
      
      <!-- No Categories -->
      <div v-else class="text-center py-6 bg-gray-50 rounded-lg">
        <p class="text-gray-500">No se encontraron categorías</p>
      </div>
    </div>

    <!-- Guides Grid -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Loading State for Guides -->
      <div v-if="isLoading">
        <CommonLoading message="Cargando guías..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-6">
        <CommonErrorMessage :message="error" />
      </div>

      <!-- No Guides Found -->
      <div v-else-if="guides.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
        <p class="text-gray-500 mb-4">No se encontraron guías en esta categoría.</p>
        <button
          v-if="selectedCategory"
          @click="selectedCategory = ''; resetCategory();"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          Ver todas las guías
        </button>
      </div>

      <!-- Guides List -->
      <template v-else>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <span v-if="selectedCategory">
            {{ getCategoryNameBySlug(selectedCategory) }}
          </span>
          <span v-else>Guías Destacadas</span>
          <span v-if="selectedCategory" class="ml-2 text-sm font-normal text-gray-500">
            ({{ totalGuides }} {{ totalGuides === 1 ? 'guía' : 'guías' }})
          </span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="guide in guides"
            :key="guide.id"
            :to="`/guides/${guide.slug}`"
            class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
          >
            <span
              class="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded mb-4"
            >
              {{ guide.category_name || getCategoryForGuide(guide.slug) }}
            </span>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-3">
              {{ guide.title }}
            </h3>
            <p class="text-gray-600 mb-4">
              {{ guide.description }}
            </p>
            <div class="flex items-center text-sm text-primary-600">
              <span>Ver guía completa</span>
              <ChevronRight class="w-4 h-4 ml-1" />
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-10 flex justify-center">
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded border"
              :class="
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              "
            >
              Anterior
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              @click="changePage(page)"
              class="px-3 py-2 rounded"
              :class="
                currentPage === page ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
              "
            >
              {{ page }}
            </button>

            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded border"
              :class="
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              "
            >
              Siguiente
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- Disclaimer Footer -->
  <div class="bg-gray-50 border-t border-gray-200 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <p class="text-sm text-gray-500 italic text-center max-w-4xl mx-auto">
        El contenido de este blog tiene fines informativos y educativos. No constituye asesoramiento
        legal y no debe ser considerado como tal. Recomendamos consultar a un abogado calificado
        para obtener asesoramiento específico sobre tu situación particular. "Lexic" no se hace
        responsable por cualquier acción tomada basada en la información proporcionada en este blog.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { ChevronRight, FileText, Building, Briefcase, BookOpen, ScrollText, Users } from 'lucide-vue-next'
import { useGuides } from '~/composables/useGuides'
import { useGuideCategories, type GuideCategory } from '~/composables/useGuideCategories'
import { useRoute, useRouter } from 'vue-router'

// Definition of page meta data
definePageMeta({
  title: 'Guías Legales - Recursos Jurídicos Gratuitos',
  description:
    'Accede a guías legales completas y detalladas sobre posesión efectiva, alzamiento de hipotecas, cambio de nombre y otros temas jurídicos relevantes en Chile.'
})

// Guide data
const { guides, isLoading, error, totalGuides, totalPages, currentPage, fetchGuides } = useGuides()

// Categories
const { 
  categories, 
  isLoading: categoriesLoading, 
  error: categoriesError, 
  fetchCategories 
} = useGuideCategories()

// Route and router
const route = useRoute()
const router = useRouter()

// Selected category
const selectedCategory = ref<string>('')

// Get category name by slug
const getCategoryNameBySlug = (slug: string): string => {
  const category = categories.value.find(cat => cat.slug === slug)
  return category ? category.name : 'Categoría'
}

// Helper to categorize guides (fallback for guides without category)
const getCategoryForGuide = (slug: string): string => {
  // First try to find in category data
  for (const category of categories.value) {
    if (category.slug && category.guide_count > 0) {
      // The API doesn't give us direct mapping, so this is our best guess
      if (slug.includes(category.slug)) {
        return category.name
      }
    }
  }
  
  // Fallback to hardcoded values
  switch (slug) {
    case 'posesion-efectiva-chile':
      return 'Sucesiones'
    case 'alzamiento-hipotecas-chile':
      return 'Inmobiliario'
    case 'cambio-nombre-apellido-chile':
      return 'Civil'
    default:
      return 'Legal'
  }
}

// Set category and reset to page 1
const setCategory = (categorySlug: string) => {
  router.push({
    path: '/guides',
    query: { 
      category_slug: categorySlug || undefined,
      page: '1'
    }
  })
}

// Reset category filter
const resetCategory = () => {
  router.push({
    path: '/guides',
    query: { page: '1' }
  })
}

// Change page while preserving category filter
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  
  router.push({
    path: '/guides',
    query: {
      category_slug: selectedCategory.value || undefined,
      page: page.toString()
    }
  })
}

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    const categorySlug = newQuery.category_slug as string
    const page = newQuery.page ? parseInt(newQuery.page as string) : 1
    
    selectedCategory.value = categorySlug || ''
    
    // Fetch guides with the new parameters
    fetchGuides(page, 10, categorySlug)
  },
  { immediate: true }
)

onMounted(async () => {
  // Fetch categories
  await fetchCategories()
  
  // Initialize category from URL query parameter
  const categorySlug = route.query.category_slug as string
  const page = route.query.page ? parseInt(route.query.page as string) : 1
  selectedCategory.value = categorySlug || ''
  
  // Fetch guides with initial parameters
  await fetchGuides(page, 10, categorySlug)
  
  // Log for debugging
  console.log('Loaded categories:', categories.value)
})
</script>