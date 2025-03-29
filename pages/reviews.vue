<template>
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Mis Reseñas</h1>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="bg-white rounded-lg shadow p-8 text-center">
          <CommonLoading message="Cargando tus reseñas..." />
        </div>
        
        <!-- Not authenticated state -->
        <div v-else-if="!isAuthenticated" class="bg-white rounded-lg shadow p-8 text-center">
          <p class="text-gray-600 mb-4">Debes iniciar sesión para ver tus reseñas</p>
          <button 
            @click="showAuthModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Iniciar Sesión
          </button>
          
          <AuthModal 
            :show="showAuthModal" 
            @close="showAuthModal = false" 
            @login="handleLogin" 
          />
        </div>
        
        <!-- Empty State -->
        <div v-else-if="reviews.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <p class="text-gray-500 mb-4">No has escrito ninguna reseña aún.</p>
          <NuxtLink to="/lawyers" class="text-primary-600 hover:text-primary-700 font-medium">
            Explorar abogados
          </NuxtLink>
        </div>
        
        <!-- Reviews List -->
        <div v-else class="grid grid-cols-1 gap-6">
          <div 
            v-for="review in reviews" 
            :key="review.id" 
            class="bg-white p-6 rounded-lg shadow border"
          >
            <!-- Lawyer Info and Review Actions -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <NuxtLink 
                  :to="`/lawyers/${review.lawyerId}`"
                  class="font-medium text-primary-600 hover:text-primary-800"
                >
                  Ver Abogado
                </NuxtLink>
              </div>
              
              <!-- Add Review Actions Component -->
              <div class="flex items-center space-x-2">
                <div class="text-sm text-gray-500 mr-2">
                  {{ new Date(review.date).toLocaleDateString() }}
                </div>
                <ReviewActions
                  :can-edit="true"
                  @edit="editReview(review)"
                  @delete="handleReviewDelete(review.id, review.lawyerId)"
                />
              </div>
            </div>
            
            <!-- Review Content -->
            <div>
              <h3 v-if="review.title" class="font-medium text-gray-900 mb-1">
                {{ review.title }}
              </h3>
              <CommonStarRating 
                :score="review.rating" 
                class="mb-2" 
              />
              <p class="text-gray-600 mb-3">{{ review.content }}</p>
            </div>
            
            <!-- Actions -->
            <div class="mt-4 flex justify-end">
              <NuxtLink 
                :to="`/lawyers/${review.lawyerId}?tab=reviews`" 
                class="text-primary-600 hover:text-primary-800 text-sm"
              >
                Ver en perfil del abogado
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Review Modal for Editing -->
      <ReviewModal
        v-if="reviewToEdit && selectedLawyerId"
        :show="showReviewModal"
        :lawyer="{id: selectedLawyerId, name: 'Abogado'}"
        :review-to-edit="reviewToEdit"
        @close="handleCloseReviewModal"
        @update="handleReviewUpdate"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useAuth } from '~/composables/useAuth'
  import { useUserService, useReviewsService } from '~/services/api'
  import { useNotifications } from '~/composables/useNotifications'
  import AuthModal from '~/components/auth/Modal.vue'
  import ReviewModal from '~/components/review/Modal.vue'
  import ReviewActions from '~/components/review/Actions.vue'
  import type { LawyerReview } from '~/types/review'
  
  // Auth state
  const { user, isAuthenticated, authLoading } = useAuth()
  const showAuthModal = ref(false)
  
  // Reviews state
  const reviews = ref<LawyerReview[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Edit/delete functionality
  const reviewToEdit = ref<LawyerReview | undefined>(undefined)
  const showReviewModal = ref(false)
  const selectedLawyerId = ref<string | null>(null)
  
  // Notifications
  const { success, error: showError } = useNotifications()
  
  // Load user reviews
  const loadUserReviews = async () => {
    if (!isAuthenticated.value || !user.value?.id) return
    
    isLoading.value = true
    error.value = null
    
    try {
      const userService = useUserService()
      const response = await userService.getReviews(user.value.id)
      reviews.value = response.reviews || []
    } catch (err) {
      console.error('Error loading reviews:', err)
      error.value = err instanceof Error ? err.message : 'Error loading reviews'
    } finally {
      isLoading.value = false
    }
  }
  
  // Handle login success
  const handleLogin = () => {
    showAuthModal.value = false
    loadUserReviews()
  }
  
  // Edit a review
  const editReview = (review: LawyerReview) => {
    reviewToEdit.value = review
    selectedLawyerId.value = review.lawyerId
    showReviewModal.value = true
  }
  
  // Handle review update
  const handleReviewUpdate = async (reviewId: string, reviewData: any) => {
    if (!selectedLawyerId.value) return
    
    try {
      const reviewsService = useReviewsService()
      await reviewsService.update(selectedLawyerId.value, reviewId, reviewData)
      
      // Update the review in the list
      const index = reviews.value.findIndex(r => r.id === reviewId)
      if (index !== -1) {
        reviews.value[index] = {
          ...reviews.value[index],
          ...reviewData
        }
      }
      
      // Close the modal
      handleCloseReviewModal()
      
      // Show success notification
      success('Reseña actualizada', 'Tu reseña ha sido actualizada correctamente')
    } catch (err) {
      showError('Error al actualizar la reseña', err instanceof Error ? err.message : 'Ocurrió un error')
    }
  }
  
  // Handle review delete
  const handleReviewDelete = async (reviewId: string, lawyerId: string) => {
    try {
      const reviewsService = useReviewsService()
      await reviewsService.delete(lawyerId, reviewId)
      
      // Remove the review from the list
      reviews.value = reviews.value.filter(r => r.id !== reviewId)
      
      // Show success notification
      success('Reseña eliminada', 'Tu reseña ha sido eliminada correctamente')
    } catch (err) {
      showError('Error al eliminar la reseña', err instanceof Error ? err.message : 'Ocurrió un error')
    }
  }
  
  // Close the review modal
  const handleCloseReviewModal = () => {
    showReviewModal.value = false
    reviewToEdit.value = undefined
    selectedLawyerId.value = null
  }
  
  onMounted(async () => {
    if (isAuthenticated.value) {
      await loadUserReviews()
    }
  })
  </script>