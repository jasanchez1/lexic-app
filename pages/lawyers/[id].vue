<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLawyerProfile } from '~/composables/useLawyerProfile'
import { useAnalytics } from '~/composables/useAnalytics'
import { Phone } from 'lucide-vue-next'
import { calculateYearsOfExperience } from '~/utils/date'
import type { Lawyer } from '~/types/lawyer'

const route = useRoute()
const lawyerId = route.params.id as string
const { profile, isLoading, error, fetchProfile } = useLawyerProfile()
const showCallModal = ref(false)
const showMessageModal = ref(false)

const handleOpenMessage = (lawyer: Lawyer) => {
  showMessageModal.value = true
  trackMessageEvent(lawyer, 'opened')
}

const { trackCallEvent, trackMessageEvent } = useAnalytics()

const handleCallClick = (lawyer: Lawyer) => {
  showCallModal.value = true
  trackCallEvent(lawyer, false)
}

const tabs = [
  { id: 'overview', name: 'Resumen' },
  { id: 'reviews', name: 'Reseñas' },
  { id: 'experience', name: 'Experiencia' }
]
const activeTab = ref('overview')

// Fetch profile on page load
onMounted(() => {
  fetchProfile(lawyerId)
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
      <!-- Profile Header Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Profile Image -->
          <div class="w-32 h-32 flex-shrink-0">
            <img
              :src="profile.imageURL"
              :alt="`Foto de ${profile.name}`"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>

          <!-- Profile Info -->
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ profile.name }}</h1>
                <p v-if="profile.alias" class="text-gray-600">
                  también conocido como {{ profile.alias }}
                </p>

                <CommonStarRating
                  :score="profile.reviewScore"
                  :review-count="profile.reviewCount"
                  :show-score="true"
                  :use-icons="true"
                />

                <div class="mt-4 space-y-2">
                  <p class="flex items-center text-gray-600">
                    <span class="font-medium mr-2">Experienciar:</span>
                    {{ calculateYearsOfExperience(profile.professionalStartDate) }} años
                  </p>
                  <p class="flex items-center text-gray-600">
                    <Icon name="lucide:map-pin" class="w-4 h-4 mr-2" />
                    {{ profile.address }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col gap-4">
                <!-- Call button -->

                <button
                  class="w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
                  @click="handleCallClick(lawyer)"
                >
                  <span class="flex items-center justify-center gap-2">
                    <Phone class="w-4 h-4" />
                    Llamar ahora
                  </span>
                </button>
                <!-- Secondary actions -->
                <button
                  class="flex items-center justify-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  @click="handleOpenMessage(profile)"
                >
                  Mensaje
                </button>

                <!-- Call Modal -->
                <LawyerCallModal
                  :lawyer="profile"
                  :show="showCallModal"
                  @close="showCallModal = false"
                />

                <!-- Message Modal -->
                <LawyerContactModal
                  :lawyer="profile"
                  :show="showMessageModal"
                  @close="showMessageModal = false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
        <div v-if="activeTab === 'overview'" class="p-6">
          <h2 class="text-xl font-bold mb-4">Sobre {{ profile.name }}</h2>
          <div class="prose max-w-none">
            <p class="text-gray-600">{{ profile.bio }}</p>
          </div>

          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Áreas de Práctica</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="area in profile.areas"
                :key="area.name"
                class="flex items-center justify-between"
              >
                <span class="text-gray-700">{{ area.name }}</span>
                <div class="w-48 bg-gray-200 rounded-full h-2 ml-4">
                  <div
                    class="bg-primary-500 h-2 rounded-full"
                    :style="{ width: `${area.experienceScore}%` }"
                  ></div>
                </div>
              </div>
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
              <span>{{ profile.qualification }} (Excelente)</span>
            </div>
          </div>
          <div class="text-gray-500 text-center py-8">Información de experiencia próximamente</div>
        </div>
      </div>
    </div>

    <!-- Message Modal -->
    <LawyerContactModal
      v-if="profile"
      :show="showMessageModal"
      :lawyer="profile"
      @close="showMessageModal = false"
    />
  </div>
</template>
