<script setup lang="ts">
import { ref } from 'vue'
import { useLawyerAreas } from '~/composables/useLawyerAreas'

const router = useRouter()
const { areas } = useLawyerAreas()
const searchQuery = ref('')

const popularAreas = areas.slice(0, 8) // Just show first 8 areas

const handleSearch = () => {
  if (!searchQuery.value.trim()) return

  router.push(`/lawyers?q=${encodeURIComponent(searchQuery.value)}`)
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-4 py-20">
        <div class="flex flex-col md:flex-row items-center justify-between gap-12">
          <!-- Left side - Text & Search -->
          <div class="flex-1 space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight">
              Encuentra el abogado ideal
              <span class="text-accent-400">para tu caso</span>
            </h1>
            <p class="text-xl text-primary-100">
              Búsqueda personalizada, reseñas verificadas y contacto directo con abogados
              especializados.
            </p>

            <!-- Search Box -->
            <div class="bg-white rounded-lg shadow-lg p-4 mt-8">
              <div class="space-y-4">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Busca por área legal o nombre del abogado"
                  class="w-full rounded-md border-gray-300 text-gray-900"
                />
                <button
                  class="w-full bg-accent-600 text-white px-6 py-3 rounded-md hover:bg-accent-700 transition-colors font-medium"
                  @click="handleSearch"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <!-- Right side - Question CTA -->
          <div class="flex-1 max-w-md">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 class="text-2xl font-bold mb-4">¿Tienes una duda legal?</h3>
              <p class="text-primary-100 mb-6">
                Obtén respuestas gratuitas de abogados expertos. Pregunta de forma anónima y recibe
                orientación legal sin compromiso.
              </p>
              <NuxtLink
                to="/questions/ask"
                class="block w-full bg-white text-primary-800 text-center px-6 py-3 rounded-md hover:bg-primary-50 transition-colors font-medium"
              >
                Hacer una Pregunta
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div class="space-y-2">
            <h3 class="text-4xl font-bold text-gray-900">2,500+</h3>
            <p class="text-gray-600">Abogados en la Red</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-4xl font-bold text-gray-900">50,000+</h3>
            <p class="text-gray-600">Consultas Resueltas</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-4xl font-bold text-gray-900">4.8/5</h3>
            <p class="text-gray-600">Satisfacción Promedio</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Areas -->
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Áreas Legales Más Consultadas</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="area in popularAreas"
            :key="area.id"
            :to="`/lawyers?area=${area.slug}`"
            class="p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
          >
            <h3 class="font-medium text-gray-900 group-hover:text-primary-600">{{ area.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ area.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
