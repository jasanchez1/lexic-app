<script setup lang="ts">
import { watchEffect, ref } from 'vue'
import { useLawyerSearch } from '~/composables/useLawyerSearch'
import { useCities } from '~/composables/useCities'

const route = useRoute()
const router = useRouter()
const {
  lawyers,
  totalLawyers,
  totalPages,
  isLoading: isLawyersLoading,
  error: LawyersError,
  searchLawyers
} = useLawyerSearch()
const { cities, isLoading: isCitiesLoading, error: CitiesError, fetchCities } = useCities()

// Pagination
const page = ref(1)

// Handle city selection
const handleCitySelect = (cityId: string) => {
  router.push({
    query: {
      ...route.query,
      city: cityId,
      page: '1' // Reset to first page on filter change
    }
  })
}

// Handle sort change
const handleSortChange = (sortValue: string) => {
  router.push({
    query: {
      ...route.query,
      sort: sortValue,
      page: '1' // Reset to first page on sort change
    }
  })
}

// Handle pagination
const goToPage = (pageNumber: number) => {
  if (pageNumber < 1 || pageNumber > totalPages.value) return

  router.push({
    query: {
      ...route.query,
      page: pageNumber.toString()
    }
  })
}

// Watch for URL changes to update search
watchEffect(() => {
  const params = {
    area: route.query.area as string,
    city: route.query.city as string,
    q: route.query.q as string,
    sort: route.query.sort as string,
    page: route.query.page ? parseInt(route.query.page as string) : 1,
    size: 10
  }

  page.value = params.page
  searchLawyers(params)
  fetchCities()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <template v-if="isCitiesLoading">
      <CommonLoading message="Cargando ciudades..." />
    </template>
    <template v-else>
      <CommonCityFilter :cities="cities" @select="handleCitySelect" />
    </template>

    <div v-if="CitiesError" class="max-w-7xl mx-auto px-4 py-6 mb-4">
      <CommonErrorMessage :message="CitiesError" />
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">
          <template v-if="isLawyersLoading">Buscando abogados...</template>
          <template v-else>
            {{ totalLawyers }} {{ totalLawyers === 1 ? 'Abogado' : 'Abogados' }}
            <template v-if="route.query.area">
              <span class="text-gray-700">especialistas en </span> 
              <span class="text-primary-600">{{ route.query.area }}</span>
            </template>
            <template v-if="route.query.city">
              <span class="text-gray-700"> en </span>
              <span class="text-primary-600">{{ route.query.city }}</span>
            </template>
            <template v-if="route.query.q">
              <span class="text-gray-700"> para </span>
              <span class="text-primary-600">"{{ route.query.q }}"</span>
            </template>
          </template>
        </h2>
        <CommonSortSelect 
          :initial-value="route.query.sort?.toString() || 'best_match'"
          @sort="handleSortChange" 
        />
      </div>

      <div v-if="LawyersError" class="mb-4">
        <CommonErrorMessage :message="LawyersError" />
      </div>

      <div v-if="isLawyersLoading">
        <!-- Show skeleton loaders -->
        <LawyerCard v-for="i in 3" :key="`skeleton-${i}`" :loading="true" :lawyer="{} as Lawyer" />
      </div>

      <div v-else-if="lawyers.length === 0" class="py-12 text-center bg-white rounded-lg shadow-sm border p-6">
        <p class="text-gray-600 mb-4">No se encontraron abogados con los filtros seleccionados.</p>
        <button
          @click="() => router.push('/lawyers')"
          class="text-primary-600 hover:text-primary-800 font-medium"
        >
          Ver todos los abogados
        </button>
      </div>

      <div v-else>
        <LawyerCard v-for="lawyer in lawyers" :key="lawyer.id" :lawyer="lawyer" />
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center">
          <div class="flex items-center space-x-1">
            <button
              class="px-3 py-1 rounded-md border"
              :class="page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
              :disabled="page === 1"
              @click="goToPage(page - 1)"
            >
              Anterior
            </button>
            
            <div v-for="p in totalPages" :key="p" class="hidden md:block">
              <button
                v-if="p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)"
                class="px-3 py-1 rounded-md"
                :class="p === page ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
                @click="goToPage(p)"
              >
                {{ p }}
              </button>
              <span
                v-else-if="(p === 2 && page > 3) || (p === totalPages - 1 && page < totalPages - 2)"
                class="px-2 py-1 text-gray-500"
              >
                ...
              </span>
            </div>
            
            <div class="md:hidden text-sm text-gray-500">
              Página {{ page }} de {{ totalPages }}
            </div>
            
            <button
              class="px-3 py-1 rounded-md border"
              :class="page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
              :disabled="page === totalPages"
              @click="goToPage(page + 1)"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>