<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useLawyerProfile } from '~/composables/useLawyerProfile'
import { useNavigation } from '~/composables/useNavigation'

const { setCurrentLawyer } = useNavigation()
const { profile, isLoading, error, fetchProfile } = useLawyerProfile()

watch(
  () => profile.value,
  newProfile => {
    if (newProfile) {
      setCurrentLawyer(newProfile)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  setCurrentLawyer(null)
})

const route = useRoute()
const lawyerId = route.params.id as string

const tabs = [
  { id: 'overview', name: 'Resumen' },
  { id: 'reviews', name: 'Reseñas' },
  { id: 'experience', name: 'Experiencia' }
]
const activeTab = ref('overview')

// Fetch profile on page load
onMounted(async () => {
  await fetchProfile(lawyerId)
})
</script>

<template>
  <div v-if="isLoading" class="max-w-7xl mx-auto px-4 py-12 text-center">
    <span class="text-gray-500">Cargando perfil...</span>
  </div>

  <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12">
    <div class="bg-red-50 p-4 rounded-md text-red-700">
      {{ error }}
    </div>
  </div>

  <div v-else-if="profile" class="min-h-screen bg-gray-50">
    <!-- Profile Content -->
    <div class="mt-8 max-w-7xl mx-auto px-4 pb-12">
      <LawyerCard :lawyer="profile" :view-profile="false" />
      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-lg shadow-sm">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="p-6 space-y-8">
          <!-- About Section -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Sobre {{ profile.name }}</h2>
            <div class="prose max-w-none">
              <p class="text-gray-600">{{ profile.bio }}</p>
            </div>
            <!-- Add a "Read Full Bio" button if bio is long -->
            <button
              v-if="profile.bio.length > 300"
              class="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Leer biografía completa
            </button>
          </div>

          <!-- Catch Phrase if exists -->
          <div
            v-if="profile.catchPhrase"
            class="bg-primary-50 p-6 rounded-lg border-l-4 border-primary-500"
          >
            <p class="text-lg text-primary-700 font-medium italic">"{{ profile.catchPhrase }}"</p>
          </div>

          <!-- Practice Areas Section with Graph -->
          <div>
            <h3 class="text-lg font-semibold mb-6">Áreas de Práctica</h3>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <!-- Areas List -->
              <div class="lg:col-span-8">
                <div class="space-y-4">
                  <div
                    v-for="area in profile.areas"
                    :key="area.name"
                    class="flex items-center justify-between"
                  >
                    <div class="flex-1">
                      <div class="flex justify-between mb-1">
                        <span class="text-gray-700 font-medium">{{ area.name }}</span>
                        <span class="text-gray-500">{{ area.experienceScore }}%</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-2">
                        <div
                          class="bg-primary-500 h-2 rounded-full transition-all duration-500"
                          :style="{ width: `${area.experienceScore}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Stats Circle -->
              <div class="lg:col-span-4">
                <div class="bg-gray-50 rounded-lg p-6 text-center">
                  <div class="text-4xl font-bold text-primary-600 mb-2">
                    {{ profile.areas.length }}
                  </div>
                  <p class="text-gray-600">Áreas de Práctica</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Languages if any -->
            <div v-if="profile.languages?.length" class="bg-white p-6 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Idiomas</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="lang in profile.languages"
                  :key="lang"
                  class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {{ lang }}
                </span>
              </div>
            </div>

            <!-- Education if any -->
            <div v-if="profile.education?.length" class="bg-white p-6 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Educación</h4>
              <ul class="space-y-2">
                <li v-for="edu in profile.education" :key="edu.school" class="text-gray-600">
                  {{ edu.degree }} - {{ edu.school }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Reseñas de Clientes</h2>
            <button
              class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Escribir Reseña
            </button>
          </div>
          <div class="text-gray-500 text-center py-8">No hay reseñas disponibles</div>
        </div>

        <!-- Experience Tab -->
        <div v-if="activeTab === 'experience'" class="p-6">
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <div class="flex items-center justify-between">
              <span class="font-semibold">Calificación:</span>
              <span>{{ profile.reviewScore }} (Excelente)</span>
            </div>
          </div>
          <div class="text-gray-500 text-center py-8">Información de experiencia próximamente</div>
        </div>
      </div>
    </div>
  </div>
</template>
