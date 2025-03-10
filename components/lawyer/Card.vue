<script setup lang="ts">
import { ref } from 'vue'
import { Phone } from 'lucide-vue-next'
import { useAnalytics } from '~/composables/useAnalytics'
import { calculateYearsOfExperience } from '~/utils/date'
import type { Lawyer, PracticeArea } from '~/types/lawyer'
import LawyerCallModal from './CallModal.vue'
import LawyerContactModal from './ContactModal.vue'

const props = withDefaults(
  defineProps<{
    lawyer: Lawyer
    viewProfile?: boolean
    loading?: boolean
  }>(),
  {
    viewProfile: true,
    loading: false
  }
)

const { trackProfileView, trackCallEvent, trackMessageEvent } = useAnalytics()

const showCallModal = ref(false)
const showMessageModal = ref(false)

const handleOpenMessage = () => {
  showMessageModal.value = true
  trackMessageEvent(props.lawyer, 'opened')
}

const handleCallClick = (lawyer: Lawyer) => {
  showCallModal.value = true
  trackCallEvent(lawyer, false)
}
</script>

<template>
  <!-- Skeleton loader -->
  <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6 mb-4 animate-pulse">
    <div class="flex justify-between">
      <!-- Left side with lawyer info -->
      <div class="flex">
        <div class="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg"></div>
        <div class="ml-6 space-y-3">
          <div class="h-6 bg-gray-200 rounded w-40"></div>
          <div class="h-4 bg-gray-200 rounded w-32"></div>
          <div class="h-4 bg-gray-200 rounded w-24"></div>
          <div class="mt-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-48"></div>
            <div class="h-4 bg-gray-200 rounded w-64"></div>
            <div class="h-4 bg-gray-200 rounded w-56"></div>
          </div>
        </div>
      </div>

      <!-- Right side with actions -->
      <div class="flex flex-col gap-4 self-center">
        <div class="w-32 h-10 bg-gray-200 rounded-md"></div>
        <div class="grid grid-cols-2 gap-2">
          <div class="h-10 bg-gray-200 rounded-md"></div>
          <div class="h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Actual content -->
  <div
    v-else
    :class="[
      'bg-white rounded-lg shadow-sm p-6 mb-4',
      props.viewProfile ? 'hover:shadow-md transition-shadow' : ''
    ]"
  >
    <div class="flex justify-between">
      <!-- Left side with lawyer info -->
      <div class="flex">
        <div class="w-32 h-32 flex-shrink-0">
          <img
            :src="lawyer.imageURL"
            :alt="lawyer.name"
            class="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div class="ml-6">
          <NuxtLink
            v-if="viewProfile"
            :to="`/lawyers/${lawyer.id}`"
            @click="trackProfileView(lawyer, 'name')"
          >
            <h3 class="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
              {{ lawyer.name }}
            </h3>
          </NuxtLink>
          <h3 v-else class="text-xl font-bold text-gray-900">
            {{ lawyer.name }}
          </h3>
          <CommonStarRating
            :score="lawyer.reviewScore"
            :review-count="lawyer.reviewCount"
            :show-score="true"
            :use-icons="true"
            :reviews-url="`/lawyers/${lawyer.id}?tab=reviews`"
          />
          <div class="text-sm text-gray-600">{{ lawyer.title }}</div>
          <div class="mt-4">
            <div class="text-sm">
              <span class="font-medium">
                Experiencia: {{ calculateYearsOfExperience(lawyer.professionalStartDate) }}
              </span>
            </div>
            <div v-if="lawyer.areas.length > 0" class="text-sm mt-1">
              <span class="font-medium">Áreas practicas:</span>
              {{ lawyer.areas.map((x: PracticeArea) => x.name).join(', ') }}
            </div>
            <p class="mt-2 text-sm text-gray-600 line-clamp-2">
              {{ lawyer.bio }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right side with actions -->
      <div class="flex flex-col gap-4 self-center">
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

        <!-- Action buttons -->
        <div v-if="viewProfile" class="grid grid-cols-2 gap-2">
          <NuxtLink
            :to="`/lawyers/${lawyer.id}`"
            class="flex items-center justify-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            @click="trackProfileView(lawyer, 'button')"
          >
            Ver Perfil
          </NuxtLink>
          <button
            class="flex items-center justify-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            @click="handleOpenMessage"
          >
            Mensaje
          </button>
        </div>
        <div v-else class="grid grid-cols">
          <button
            class="flex items-center justify-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            @click="handleOpenMessage"
          >
            Mensaje
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <LawyerCallModal :lawyer="lawyer" :show="showCallModal" @close="showCallModal = false" />

    <LawyerContactModal
      :lawyer="lawyer"
      :show="showMessageModal"
      @close="showMessageModal = false"
    />
  </div>
</template>