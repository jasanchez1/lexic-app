<script setup lang="ts">
import { ref } from 'vue'
import { Search, MapPin } from 'lucide-vue-next'
import { useLawyerAreas } from '~/composables/useLawyerAreas'

const router = useRouter()
const { areas } = useLawyerAreas()
const searchQuery = ref('')
const locationQuery = ref('')

const popularAreas = areas.slice(0, 8)

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  router.push(
    `/lawyers?q=${encodeURIComponent(searchQuery.value)}${locationQuery.value ? `&location=${encodeURIComponent(locationQuery.value)}` : ''}`
  )
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-4 py-20">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left side - Text & Search -->
          <div class="space-y-8 max-w-xl">
            <div class="space-y-4">
              <h1 class="text-4xl md:text-5xl font-bold leading-tight">
                Encuentra el abogado ideal
                <span class="text-primary-200">para tu caso</span>
              </h1>
              <p class="text-xl text-primary-100">
                Búsqueda personalizada, reseñas verificadas y contacto directo con abogados
                especializados.
              </p>
            </div>

            <!-- Search Box -->
            <div class="bg-white rounded-lg shadow-lg p-2">
              <div class="flex flex-col md:flex-row gap-2">
                <div class="flex-1 flex items-center bg-gray-50 rounded-md">
                  <Search class="w-5 h-5 text-gray-400 ml-3" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Busca por área legal o nombre del abogado"
                    class="w-full bg-transparent px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                    @keyup.enter="handleSearch"
                  />
                </div>
                <div class="flex items-center bg-gray-50 rounded-md md:w-48">
                  <MapPin class="w-5 h-5 text-gray-400 ml-3" />
                  <input
                    v-model="locationQuery"
                    type="text"
                    placeholder="Ubicación"
                    class="w-full bg-transparent px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                    @keyup.enter="handleSearch"
                  />
                </div>
                <button
                  class="w-full md:w-auto bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-md font-medium transition-colors duration-200"
                  @click="handleSearch"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <!-- Right side - Question CTA -->
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h3 class="text-2xl font-bold mb-4">¿Tienes una duda legal?</h3>
            <p class="text-primary-100 mb-6">
              Obtén respuestas gratuitas de abogados expertos. Pregunta de forma anónima y recibe
              orientación legal sin compromiso.
            </p>
            <NuxtLink
              to="/questions/ask"
              class="block w-full bg-white text-primary-800 text-center px-6 py-3 rounded-md hover:bg-primary-50 transition-colors duration-200 font-medium"
            >
              Hacer una Pregunta
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-primary-600 text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div class="space-y-2">
            <h3 class="text-3xl font-bold">1.1+ million</h3>
            <p class="text-primary-100">Abogados en la Red</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-3xl font-bold">65+ million</h3>
            <p class="text-primary-100">Visitantes Anuales</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-3xl font-bold">17+ million</h3>
            <p class="text-primary-100">Consultas Resueltas</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Areas -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Áreas Legales Más Consultadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="area in popularAreas"
            :key="area.id"
            :to="`/lawyers?area=${area.slug}`"
            class="p-6 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 group"
          >
            <h3 class="font-medium text-gray-900 group-hover:text-primary-600">{{ area.name }}</h3>
            <p class="text-sm text-gray-500 mt-2">{{ area.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
