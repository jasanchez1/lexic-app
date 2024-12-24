<script setup lang="ts">
import { watchEffect } from 'vue'
import { useLawyerSearch } from '~/composables/useLawyerSearch'

const route = useRoute()
const { lawyers, isLoading, error, searchLawyers } = useLawyerSearch()

// Watch for URL changes to update search
watchEffect(() => {
  const params = {
    area: route.query.area as string,
    city: route.query.city as string,
    query: route.query.q as string,
    sort: route.query.sort as string
  }

  searchLawyers(params)
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <CityFilter :cities="cities" />

    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">
          <template v-if="isLoading">Buscando abogados...</template>
          <template v-else>
            {{ lawyers.length }} {{ lawyers.length === 1 ? 'Abogado' : 'Abogados' }}
            {{ route.query.area ? `en ${route.query.area}` : '' }}
          </template>
        </h2>
        <SortSelect />
      </div>

      <div v-if="error" class="text-red-600 mb-4">
        {{ error }}
      </div>

      <div v-if="isLoading" class="py-12 text-center">
        <span class="text-gray-500">Cargando...</span>
      </div>

      <div v-else>
        <LawyerCard v-for="lawyer in lawyers" :key="lawyer.id" :lawyer="lawyer" />
      </div>
    </div>
  </div>
</template>
