import { ref } from 'vue'
import { useFetch } from '~/utils/api'
import type { LawyerReview, ReviewStats } from '~/types/review'
import { useReviewsService } from '~/services/api'
import { mapApiResponseToModel } from '~/utils/caseConverters'

export const useReviews = () => {
  const api = useFetch()
  const reviewsService = useReviewsService()
  const { user } = useAuth() // Get the current user
  const reviews = ref<LawyerReview[]>([])
  const stats = ref<ReviewStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // New computed property to filter user's reviews
  const userReviews = computed(() => {
    if (!user.value) return []
    return reviews.value.filter(review => review.userId === user.value.id)
  })

  // Check if user can edit a review
  const canEditReview = (reviewId: string) => {
    if (!user.value) return false
    const review = reviews.value.find(r => r.id === reviewId)
    return review && review.userId === user.value.id
  }

  const fetchReviews = async (lawyerId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await reviewsService.getForLawyer(lawyerId)

      reviews.value = response.reviews || []
      stats.value = response.stats || null

      return { reviews: reviews.value, stats: stats.value }
    } catch (e) {
      console.error('Error fetching reviews:', e)
      error.value = e instanceof Error ? e.message : 'Error al cargar las reseñas'
      reviews.value = []
      stats.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  const submitReview = async (lawyerId: string, reviewData: any) => {
    try {
      // Include user ID in review data
      reviewData.author = {
        name: reviewData.authorName,
        email: reviewData.authorEmail
      }
      reviewData.user_id = user.value?.id

      const response = await reviewsService.create(lawyerId, reviewData)

      // Refresh reviews after submission
      await fetchReviews(lawyerId)

      return { success: true, reviewId: response.id }
    } catch (error) {
      console.error('Error submitting review:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al enviar la reseña'
      }
    }
  }

  // Update method to update review
  const updateReview = async (lawyerId: string, reviewId: string, reviewData: any) => {
    try {
      if (!canEditReview(reviewId)) {
        return { success: false, error: 'No tienes permiso para editar esta reseña' }
      }

      const response = await reviewsService.update(lawyerId, reviewId, reviewData)
      const updatedReview = mapApiResponseToModel(response)

      // Update the review in the local state immediately
      const index = reviews.value.findIndex(r => r.id === reviewId)
      if (index !== -1) {
        // Merge the existing review with the updated data to preserve data not included in the update
        reviews.value[index] = {
          ...reviews.value[index],
          ...updatedReview,
          // Ensure these fields are always updated
          rating: reviewData.rating,
          title: reviewData.title,
          content: reviewData.content
        }
      }

      return { success: true, review: updatedReview }
    } catch (error) {
      console.error('Error updating review:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar la reseña'
      }
    }
  }

const deleteReview = async (lawyerId: string, reviewId: string) => {
  try {
    if (!canEditReview(reviewId)) {
      return { success: false, error: 'No tienes permiso para eliminar esta reseña' }
    }

    await reviewsService.delete(lawyerId, reviewId)
    
    // Update local state after successful deletion
    reviews.value = reviews.value.filter(r => r.id !== reviewId)
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting review:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar la reseña'
    }
  }
}

  return {
    reviews,
    userReviews,
    stats,
    isLoading,
    error,
    fetchReviews,
    submitReview,
    updateReview,
    deleteReview,
    canEditReview
  }
}
