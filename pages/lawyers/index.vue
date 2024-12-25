<script setup lang="ts">
import { watchEffect } from 'vue'
import { useLawyerSearch } from '~/composables/useLawyerSearch'
import { useCities } from '~/composables/useCities'

const route = useRoute()
const {
  lawyers,
  isLoading: isLawyersLoading,
  error: LawyersError,
  searchLawyers
} = useLawyerSearch()
const { cities, isLoading: isCitiesLoading, error: CitiesError, fetchCities } = useCities()

// Watch for URL changes to update search
watchEffect(() => {
  const params = {
    area: route.query.area as string,
    city: route.query.city as string,
    query: route.query.q as string,
    sort: route.query.sort as string
  }

  searchLawyers(params)
  fetchCities()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <template v-if="isCitiesLoading">
      <div class="py-12 text-center">
        <span class="text-gray-500">Cargando...</span>
      </div>
    </template>
    <template v-else>
      <CommonCityFilter :cities="cities" />
    </template>

    <div v-if="CitiesError" class="text-red-600 mb-4">
      {{ CitiesError }}
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">
          <template v-if="isLawyersLoading">Buscando abogados...</template>
          <template v-else>
            {{ lawyers.length }} {{ lawyers.length === 1 ? 'Abogado' : 'Abogados' }}
            {{ route.query.area ? `en ${route.query.area}` : '' }}
          </template>
        </h2>
        <SortSelect />
      </div>

      <div v-if="LawyersError" class="text-red-600 mb-4">
        {{ LawyersError }}
      </div>

      <div v-if="isLawyersLoading" class="py-12 text-center">
        <span class="text-gray-500">Cargando...</span>
      </div>

      <div v-else>
        <LawyerCard v-for="lawyer in lawyers" :key="lawyer.id" :lawyer="lawyer" />
      </div>
    </div>
  </div>
</template>
