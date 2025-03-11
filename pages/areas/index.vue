<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-4">Áreas de Práctica Legal</h1>
        <p class="text-xl text-primary-100 mb-6">
          Explore todas las áreas en las que nuestros abogados se especializan
        </p>
        
        <!-- Search Bar -->
        <div class="mt-8 max-w-2xl">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar áreas legales..."
            class="w-full px-4 py-3 rounded-lg pl-10 pr-4 bg-white text-gray-900"
          />
        </div>
      </div>
    </div>

    <!-- Areas Grid -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Cargando áreas...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700">
        {{ error }}
      </div>
      
      <div v-else-if="Object.keys(filteredGroupedAreas).length === 0" class="text-center py-12">
        <p class="text-gray-500 mb-4">No se encontraron áreas que coincidan con "{{ searchQuery }}"</p>
        <button 
          @click="searchQuery = ''" 
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          Ver todas las áreas
        </button>
      </div>
      
      <div v-else class="space-y-12">
        <div v-for="(areas, category) in filteredGroupedAreas" :key="category" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ categories[category] }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="area in areas"
              :key="area.id"
              :to="`/lawyers?area=${area.slug}`"
              class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
            >
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                {{ area.name }}
              </h3>
              <p v-if="area.description" class="mt-2 text-gray-600">
                {{ area.description }}
              </p>
              <p v-else class="mt-2 text-gray-600">
                Abogados especializados en {{ area.name.toLowerCase() }}
              </p>
              <div class="mt-4 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ getLawyerCount(area.id) }} abogados
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Find a lawyer CTA -->
    <div class="bg-primary-50 border-t">
      <div class="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Necesita un abogado especializado?</h2>
        <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
          Encuentre el profesional ideal para su caso entre nuestra red de abogados verificados
        </p>
        <NuxtLink
          to="/lawyers"
          class="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
        >
          Buscar Abogados
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLawyerAreas } from '~/composables/useLawyerAreas'

const { groupedAreas, categories, isLoading, error, fetchAreasWithCounts } = useLawyerAreas()
const searchQuery = ref('')

// Get lawyer count for an area
const getLawyerCount = (areaId: string) => {
  // Find the area in our grouped areas
  for (const categoryId in groupedAreas.value) {
    const area = groupedAreas.value[categoryId]?.find(a => a.id === areaId)
    if (area && 'lawyerCount' in area) {
      return area.lawyerCount || 0
    }
  }
  return 0
}

// Filter areas based on search query
const filteredGroupedAreas = computed(() => {
  if (!searchQuery.value.trim()) return groupedAreas.value

  const result: Record<string, PracticeArea[]> = {}
  const query = searchQuery.value.toLowerCase()

  for (const categoryId in groupedAreas.value) {
    const filteredAreas = groupedAreas.value[categoryId].filter(area => 
      area.name.toLowerCase().includes(query) || 
      (area.description && area.description.toLowerCase().includes(query))
    )

    if (filteredAreas.length > 0) {
      result[categoryId] = filteredAreas
    }
  }

  return result
})

onMounted(async () => {
  await fetchAreasWithCounts()
})
</script>