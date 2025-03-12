<script setup lang="ts">
import { ref } from 'vue'
import { Phone } from 'lucide-vue-next'
import { useAnalytics } from '~/composables/useAnalytics'
import { useAuth } from '~/composables/useAuth'
import type { Lawyer } from '~/types/lawyer'
import LawyerCallModal from './CallModal.vue'
import LawyerContactModal from './ContactModal.vue'
import AuthModal from '~/components/auth/Modal.vue'

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
const { isAuthenticated } = useAuth() // Add this

const showCallModal = ref(false)
const showMessageModal = ref(false)
const showAuthModal = ref(false) // Add this for auth modal

const handleOpenMessage = () => {
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    showAuthModal.value = true
    return
  }

  showMessageModal.value = true
  trackMessageEvent(props.lawyer, 'opened')
}

const handleCallClick = (lawyer: Lawyer) => {
  showCallModal.value = true
  trackCallEvent(lawyer, false)
}

// Profile view tracking helpers
const trackClick = (source: 'name' | 'button') => {
  // This is now a synchronous function that will not interfere with navigation
  if (props.lawyer && !props.loading) {
    trackProfileView(props.lawyer, source)
  }
}

// Handle login success
const handleLoginSuccess = () => {
  showAuthModal.value = false
  // Now show the message modal
  showMessageModal.value = true
  trackMessageEvent(props.lawyer, 'opened')
}
</script>

<template>
  <!-- Skeleton loader - no changes here -->
  <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6 mb-4 animate-pulse">
    <!-- Skeleton markup... (unchanged) -->
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
      <!-- Left side with lawyer info - no changes -->
      <div class="flex">
        <div class="w-32 h-32 flex-shrink-0">
          <img
            :src="lawyer.imageURL"
            :alt="lawyer.name"
            class="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div class="ml-6">
          <NuxtLink v-if="viewProfile" :to="`/lawyers/${lawyer.id}`" @click="trackClick('name')">
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
            @click="trackClick('button')"
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

    <!-- Auth Modal -->
    <AuthModal :show="showAuthModal" @close="showAuthModal = false" @login="handleLoginSuccess" />
  </div>
</template>
