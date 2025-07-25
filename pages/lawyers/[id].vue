<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { useLawyerProfile } from '~/composables/useLawyerProfile'
import { useNavigation } from '~/composables/useNavigation'
import { useReviews } from '~/composables/useReviews'
import { useLawyerTabs } from '~/composables/useLawyerTabs'
import { useLawyerExperience } from '~/composables/useLawyerExperience'
import { useAuth } from '~/composables/useAuth'
import { CheckCircle } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import ReviewActions from '~/components/review/Actions.vue'
import type { LawyerReview } from '~/types/review'
import { useExperienceLevels } from '~/composables/useExperienceLevels'

const { setCurrentLawyer } = useNavigation()
const { profile, isLoading, error, fetchProfile } = useLawyerProfile()
const {
  reviews,
  stats: reviewStats,
  isLoading: reviewsLoading,
  error: reviewsError,
  fetchReviews,
  submitReview,
  updateReview,
  deleteReview,
  canEditReview // Use the new helper method
} = useReviews()
const { tabs, activeTab, setActiveTab } = useLawyerTabs()
const { isAuthenticated } = useAuth()
const showReviewModal = ref(false)
const showAuthModal = ref(false)
const reviewToEdit = ref<LawyerReview | undefined>(undefined) // For editing reviews

const {
  getExperienceLevelName,
  getExperienceLevelColor,
  getExperienceLevelTextColor,
} = useExperienceLevels()

// Sort areas by experience level (highest first)
const sortedAreas = computed(() => {
  if (!profile.value) return []

  return [...profile.value.areas].sort((a, b) => {
    return b.experienceScore - a.experienceScore
  })
})


const {
  education,
  workExperience,
  achievements,
  stats: experienceStats,
  isLoading: expLoading,
  error: expError,
  fetchExperience
} = useLawyerExperience()

// Fetch when tab changes to experience
watch(activeTab, async newTab => {
  if (newTab === 'experience' && profile.value) {
    await fetchExperience(profile.value.id)
  }
})

const openReviewModal = () => {
  reviewToEdit.value = undefined // Reset edit state
  if (!isAuthenticated.value) {
    showAuthModal.value = true
  } else {
    showReviewModal.value = true
  }
}

const handleLoginSuccess = () => {
  showAuthModal.value = false
  // Now show the review modal
  showReviewModal.value = true
}

// Handle review submission
const handleReviewSubmit = async (review: LawyerReview) => {
  if (!profile.value) return

  const result = await submitReview(profile.value.id, review)

  if (result.success) {
    showReviewModal.value = false
    // Optionally scroll to reviews section
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })
  } else {
    // Handle error
    console.error(result.error)
  }
}

// New method to handle closing the review modal
const handleCloseReviewModal = () => {
  showReviewModal.value = false
  reviewToEdit.value = undefined // Clear edit state
}

const editReview = (review: LawyerReview) => {
  reviewToEdit.value = review
  showReviewModal.value = true
}

const handleReviewUpdate = async (reviewId: string, reviewData: any) => {
  if (!profile.value) return

  const result = await updateReview(profile.value.id, reviewId, reviewData)

  if (result.success) {
    // Close the modal
    showReviewModal.value = false
    reviewToEdit.value = undefined

    // No need to reload the page - the state is already updated in the composable
  } else {
    // Show error to user
    // You could add a toast notification here
    console.error(result.error)
  }
}

const handleReviewDelete = async (reviewId: string) => {
  if (!profile.value) return

  try {
    const result = await deleteReview(profile.value.id, reviewId)

    if (result.success) {
      // Refresh reviews from server to ensure UI is up to date
      await fetchReviews(profile.value.id)
    }
  } catch (error) {
    console.error('Error handling review deletion:', error)
  }
}

// Fetch reviews when reviews tab is active
watch(activeTab, async newTab => {
  if (newTab === 'reviews' && profile.value) {
    await fetchReviews(profile.value.id)
  }
})

// Update current lawyer in navigation store
watch(
  () => profile.value,
  newProfile => {
    if (newProfile) {
      setCurrentLawyer(newProfile)
    }
  },
  { immediate: true }
)

// Clean up on component unmount
onUnmounted(() => {
  setCurrentLawyer(null)
})

const route = useRoute()
const lawyerId = route.params.id as string

// Initial data fetch on mount
onMounted(async () => {
  await fetchProfile(lawyerId)

  if (activeTab.value === 'reviews' && profile.value) {
    await fetchReviews(profile.value.id)
  }
  if (activeTab.value === 'experience' && profile.value) {
    await fetchExperience(profile.value.id)
  }
})
</script>

<template>
  <div v-if="isLoading" class="max-w-7xl mx-auto px-4 py-12">
    <CommonLoading message="Cargando perfil..." :full-screen="true" />
  </div>

  <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12">
    <CommonErrorMessage :message="error" full-width />
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
            @click="setActiveTab(tab.id)"
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
            <h3 class="text-lg font-semibold mb-4">Áreas de Práctica</h3>

            <!-- Simple list layout with clear text -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <!-- Areas List -->
              <div class="lg:col-span-3">
                <div class="space-y-3">
                  <div
                    v-for="area in sortedAreas"
                    :key="area.id"
                    class="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div>
                      <h4 class="font-semibold text-gray-900">{{ area.name }}</h4>
                      <p
                        class="text-sm font-medium"
                        :class="getExperienceLevelTextColor(area.experienceScore)"
                      >
                        {{ getExperienceLevelName(area.experienceScore) }}
                      </p>
                    </div>
                    <!-- Experience indicator dot -->
                    <div
                      class="w-4 h-4 rounded-full"
                      :class="getExperienceLevelColor(area.experienceScore)"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Stats Summary -->
              <div class="lg:col-span-1">
                <div class="bg-primary-50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-primary-600">
                    {{ profile.areas.length }}
                  </div>
                  <p class="text-sm text-gray-600">Áreas</p>
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
        <div v-if="activeTab === 'reviews'" id="reviews-section" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Reseñas de Clientes</h2>
            <button
              class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              @click="openReviewModal"
            >
              Escribir Reseña
            </button>
            <AuthModal
              :show="showAuthModal"
              @close="showAuthModal = false"
              @login="handleLoginSuccess"
            />

            <ReviewModal
              v-if="profile"
              :show="showReviewModal"
              :lawyer="profile"
              :review-to-edit="reviewToEdit"
              @close="handleCloseReviewModal"
              @submit="handleReviewSubmit"
              @update="handleReviewUpdate"
            />
          </div>

          <div v-if="reviewsLoading" class="py-8">
            <CommonLoading message="Cargando reseñas..." />
          </div>

          <div v-else-if="reviewsError" class="mb-4">
            <CommonErrorMessage :message="reviewsError" type="error" />
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Stats Summary -->
            <div class="lg:col-span-1">
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="font-semibold text-lg mb-4">Calificación General</h3>
                <div class="flex items-center mb-6">
                  <span class="text-3xl font-bold">{{ reviewStats?.average.toFixed(1) }}</span>
                  <span class="text-gray-500 ml-1">/5.0</span>
                </div>

                <!-- Rating Distribution -->
                <div class="space-y-2">
                  <div v-for="n in 5" :key="n" class="flex items-center">
                    <span class="w-12 text-sm text-gray-600">{{ n }} star</span>
                    <div class="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-yellow-400 rounded-full"
                        :style="{ width: `${reviewStats?.distribution[n] || 0}%` }"
                      ></div>
                    </div>
                    <span class="w-12 text-sm text-gray-600 text-right">
                      {{ reviewStats?.distribution[n] || 0 }}%
                    </span>
                  </div>
                </div>

                <div class="mt-4 text-sm text-gray-500 text-center">
                  Basado en {{ reviewStats?.total }} reseñas
                </div>
              </div>
            </div>

            <!-- Reviews List -->
            <div class="lg:col-span-2 space-y-6">
              <div
                v-for="review in reviews"
                :id="`review-${review.id}`"
                :key="review.id"
                class="bg-white p-6 rounded-lg border"
              >
                <!-- Review Header -->
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 v-if="review.title" class="font-medium text-gray-900">
                      {{ review.title }}
                    </h4>
                    <CommonStarRating
                      :score="review.rating"
                      class="mb-2"
                      :reviews-url="`/lawyers/${profile.id}?tab=reviews`"
                    />
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-500">
                      {{ formatDate(review.date) }}
                    </div>
                    <!-- Review Actions (edit/delete) - only show for user's own reviews -->
                    <ReviewActions
                      :can-edit="canEditReview(review.id) ? true : false"
                      @edit="editReview(review)"
                      @delete="handleReviewDelete(review.id)"
                    />
                  </div>
                </div>

                <!-- Review Content -->
                <p class="text-gray-600 mb-4">{{ review.content }}</p>

                <!-- Review Footer -->
                <div class="flex items-center justify-between text-sm">
                  <div class="text-gray-500">
                    <template v-if="review.isAnonymous"> Anónimo </template>
                    <template v-else> Por {{ review.author.name }} </template>
                  </div>
                  <div v-if="review.isHired" class="flex items-center text-green-600">
                    <CheckCircle class="w-4 h-4 mr-1" />
                    Cliente Verificado
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="reviews.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
                <p class="text-gray-500">No hay reseñas disponibles</p>
                <button
                  class="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                  @click="openReviewModal"
                >
                  Sé el primero en escribir una reseña
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Experience Tab -->
        <div v-if="activeTab === 'experience'" class="p-6">
          <div v-if="expLoading" class="py-8">
            <CommonLoading message="Cargando experiencia..." />
          </div>

          <div v-else-if="expError" class="mb-4">
            <CommonErrorMessage :message="expError" />
          </div>

          <div v-else class="space-y-8">
            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-if="experienceStats?.casesWon"
                class="bg-primary-50 p-4 rounded-lg text-center"
              >
                <div class="text-2xl font-bold text-primary-600">
                  {{ experienceStats.casesWon }}
                </div>
                <div class="text-sm text-gray-600">Casos Ganados</div>
                <div class="text-xs text-gray-500">de {{ experienceStats.totalCases }} casos</div>
              </div>
              <div class="bg-primary-50 p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-primary-600">
                  {{ calculateYearsOfExperience(profile.professionalStartDate) }}
                </div>
                <div class="text-sm text-gray-600">Años de Experiencia</div>
              </div>
              <div class="bg-primary-50 p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-primary-600">
                  {{ experienceStats?.specializedAreas || profile.areas.length }}
                </div>
                <div class="text-sm text-gray-600">Áreas de Especialización</div>
              </div>
            </div>

            <!-- Education -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Educación</h3>
              <div class="space-y-4">
                <div
                  v-for="edu in education.length ? education : profile.education"
                  :key="edu.institution || edu.school + (edu.year || '')"
                  class="bg-white p-4 rounded-lg border"
                >
                  <div class="font-medium">{{ edu.degree }}</div>
                  <div class="text-gray-600">{{ edu.institution || edu.school }}</div>
                  <div class="flex justify-between mt-1">
                    <span class="text-sm text-gray-500">{{ edu.year }}</span>
                    <span v-if="edu.honors" class="text-sm text-primary-600">{{ edu.honors }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Work Experience -->
            <div v-if="workExperience.length">
              <h3 class="text-lg font-semibold mb-4">Experiencia Laboral</h3>
              <div class="space-y-4">
                <div
                  v-for="work in workExperience"
                  :key="work.company + work.startDate"
                  class="bg-white p-4 rounded-lg border"
                >
                  <div class="font-medium">{{ work.role }}</div>
                  <div class="text-gray-600">{{ work.company }}</div>
                  <div class="text-sm text-gray-500 mt-1">
                    {{ work.startDate }} -
                    {{ work.endDate == 'Present' ? 'Presente' : work.endDate }}
                  </div>
                  <p v-if="work.description" class="mt-2 text-gray-600">{{ work.description }}</p>
                </div>
              </div>
            </div>

            <!-- Achievements -->
            <div v-if="achievements.length">
              <h3 class="text-lg font-semibold mb-4">Logros y Reconocimientos</h3>
              <div class="space-y-4">
                <div
                  v-for="achievement in achievements"
                  :key="achievement.title"
                  class="bg-white p-4 rounded-lg border"
                >
                  <div class="font-medium">{{ achievement.title }}</div>
                  <div class="text-gray-600">{{ achievement.issuer }}</div>
                  <div class="text-sm text-gray-500 mt-1">{{ achievement.year }}</div>
                  <p v-if="achievement.description" class="mt-2 text-gray-600">
                    {{ achievement.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- No Experience Data Placeholder -->
            <div
              v-if="
                !education.length &&
                !workExperience.length &&
                !achievements.length &&
                !profile.education?.length
              "
              class="text-center py-12 bg-gray-50 rounded-lg"
            >
              <p class="text-gray-500">No hay información de experiencia disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
