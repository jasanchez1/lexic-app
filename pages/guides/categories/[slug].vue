<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Category Title -->
    <div class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex items-center mb-2">
          <NuxtLink to="/guides" class="text-primary-100 hover:text-white transition-colors">
            Guías Legales
          </NuxtLink>
          <span class="mx-2 text-primary-300">›</span>
          <span class="text-white">{{ categoryName }}</span>
        </div>

        <h1 class="text-3xl font-bold mb-4">{{ categoryName }}</h1>
        <p class="text-xl text-primary-100">
          Recursos y guías completas sobre {{ categoryName.toLowerCase() }}
        </p>
      </div>
    </div>

    <!-- Guides Grid -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Loading State -->
      <div v-if="isLoading">
        <CommonLoading message="Cargando guías..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-6">
        <CommonErrorMessage :message="error" />
      </div>

      <!-- No Guides Found -->
      <div v-else-if="guides.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <p class="text-gray-500 mb-4">No se encontraron guías en esta categoría.</p>
        <NuxtLink to="/guides" class="text-primary-600 hover:text-primary-700 font-medium">
          Ver todas las guías
        </NuxtLink>
      </div>

      <!-- Guides List -->
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="guide in guides"
            :key="guide.id"
            :to="`/guides/${guide.slug}`"
            class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
          >
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
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useGuides } from '~/composables/useGuides'
import { useGuideCategories, type GuideCategory } from '~/composables/useGuideCategories'
import { useRoute, useRouter } from 'vue-router'

// Route and router
const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug as string)

// Guide data
const { guides, isLoading, error, totalGuides, totalPages, currentPage, fetchGuides } = useGuides()

// Categories
const { categories, isLoading: categoriesLoading, fetchCategories } = useGuideCategories()

// Category name
const categoryName = ref('Categoría')

// Get category name from slug
const updateCategoryName = () => {
  const category = categories.value.find(cat => cat.slug === slug.value)
  categoryName.value = category ? category.name : 'Categoría'
}

// Change pagination page
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  
  router.push({
    path: `/guides/categories/${slug.value}`,
    query: { page: page.toString() }
  })
}

// Watch for route changes
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      const page = route.query.page ? parseInt(route.query.page as string) : 1
      await fetchGuides(page, 10, newSlug as string)
      updateCategoryName()
    }
  },
  { immediate: true }
)

// Watch for pagination changes
watch(
  () => route.query.page,
  async (newPage) => {
    if (newPage && slug.value) {
      const page = parseInt(newPage as string)
      await fetchGuides(page, 10, slug.value)
    }
  }
)

onMounted(async () => {
  // Fetch categories first to get category name
  await fetchCategories()
  updateCategoryName()
  
  // Fetch guides for this category
  const page = route.query.page ? parseInt(route.query.page as string) : 1
  await fetchGuides(page, 10, slug.value)
  
  // Log for debugging
  console.log('Category slug:', slug.value)
  console.log('Current category:', categories.value.find(cat => cat.slug === slug.value))
})
</script>
