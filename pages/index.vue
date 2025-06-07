<template>
  <div class="bg-gray-50">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Conecta con abogados en todo Chile
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Compara y elige la asesoria legal que mejor se adapta a tus necesidades
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Find a Lawyer Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">Buscar un Abogado</h2>
            <p class="text-gray-600">Encuentra el abogado especializado ideal para tu caso</p>
          </div>

          <div class="space-y-4">
            <div class="relative">
              <Search class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Área legal o nombre del abogado"
                class="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                @keyup.enter="handleSearch"
              />
            </div>

            <div class="flex justify-end -mb-2">
              <button
                class="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                @click="router.push('/lawyers')"
              >
                <ArrowRight class="w-4 h-4" />
                Ver todos los abogados
              </button>
            </div>

            <!-- Popular searches instead of location -->
            <div class="pt-2">
              <p class="text-sm text-gray-500 mb-2">Búsquedas populares:</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="area in popularSearches"
                  :key="area"
                  class="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  @click="
                    (() => {
                      searchQuery = area
                      handleSearch()
                    })()
                  "
                >
                  {{ area }}
                </button>
              </div>
            </div>

            <button
              class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 px-6 rounded-lg font-medium transition-colors duration-200"
              @click="handleSearch"
            >
              Buscar Abogados
            </button>
          </div>
        </div>

        <!-- Ask a Question Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">Consulta Legal Gratuita</h2>
            <p class="text-gray-600">Obtén respuestas de abogados expertos a tus dudas legales</p>
          </div>

          <div class="space-y-4 text-gray-600 mb-6">
            <div class="flex items-start space-x-3">
              <div class="mt-1 bg-primary-100 p-1 rounded-full">
                <Check class="w-4 h-4 text-primary-600" />
              </div>
              <span>Respuestas de abogados verificados</span>
            </div>
            <div class="flex items-start space-x-3">
              <div class="mt-1 bg-primary-100 p-1 rounded-full">
                <Check class="w-4 h-4 text-primary-600" />
              </div>
              <span>Consulta completamente anónima</span>
            </div>
            <div class="flex items-start space-x-3">
              <div class="mt-1 bg-primary-100 p-1 rounded-full">
                <Check class="w-4 h-4 text-primary-600" />
              </div>
              <span>Sin compromiso ni costos</span>
            </div>
          </div>

          <NuxtLink
            to="/questions/ask"
            class="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 px-6 rounded-lg font-medium text-center transition-colors duration-200"
          >
            Hacer una Pregunta
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stats with Trust Indicators -->
    <div class="border-t border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
          <div>
            <p class="text-3xl font-bold text-gray-900">2,500+</p>
            <p class="text-gray-600 mt-1">Abogados en la Red</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-gray-900">50,000+</p>
            <p class="text-gray-600 mt-1">Consultas Resueltas</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-gray-900">4.8/5</p>
            <p class="text-gray-600 mt-1">Satisfacción Promedio</p>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div class="grid md:grid-cols-3 gap-8 text-center pt-8 border-t border-gray-100">
          <div class="flex flex-col items-center">
            <Shield class="w-8 h-8 text-primary-600 mb-4" />
            <h3 class="font-semibold text-gray-900 mb-2">Abogados Verificados</h3>
            <p class="text-gray-600 text-sm">
              Todos nuestros abogados están verificados y cuentan con su titulo otorgado por el
              ministerio de justicia
            </p>
          </div>
          <div class="flex flex-col items-center">
            <Clock class="w-8 h-8 text-primary-600 mb-4" />
            <h3 class="font-semibold text-gray-900 mb-2">Respuesta Rápida</h3>
            <p class="text-gray-600 text-sm">Recibe respuestas de expertos en menos de 24 horas</p>
          </div>
          <div class="flex flex-col items-center">
            <UserCheck class="w-8 h-8 text-primary-600 mb-4" />
            <h3 class="font-semibold text-gray-900 mb-2">Servicio Personalizado</h3>
            <p class="text-gray-600 text-sm">
              Conectamos tu caso con el abogado especialista más adecuado
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Check, Shield, Clock, UserCheck, ArrowRight } from 'lucide-vue-next'

const router = useRouter()

const searchQuery = ref('')
const locationQuery = ref('')
const popularSearches = ['Derecho Laboral', 'Derecho Civil', 'Familia', 'Divorcio']

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  router.push(
    `/lawyers?q=${encodeURIComponent(searchQuery.value)}${locationQuery.value ? `&location=${encodeURIComponent(locationQuery.value)}` : ''}`
  )
}
</script>
