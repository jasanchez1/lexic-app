import { ref } from 'vue'
import { useFetch } from '~/utils/api'
import { useAuth } from '~/composables/useAuth'
import { mapApiResponseToModel, mapModelToApiRequest } from '~/utils/caseConverters'

export const useUserProfile = () => {
  const api = useFetch()
  const { user, fetchUserProfile } = useAuth()
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  /**
   * Update user profile data
   */
  const updateProfile = async (userId: string, data: {
    firstName?: string
    lastName?: string
  }) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Convert to snake_case for API
      const apiData = mapModelToApiRequest({
        ...data,
        // Include all user fields to ensure we don't lose data
        email: user.value?.email,
        id: user.value?.id,
        is_active: user.value?.isActive
      })
      
      // Send update request
      await api.patch(`/users/${userId}`, apiData)
      
      // Refresh user data to get updated values
      await fetchUserProfile()
      
      return true
    } catch (err) {
      console.error('Error updating user profile:', err)
      error.value = err instanceof Error ? err.message : 'Error updating profile'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Get user reviews (from a specific endpoint or filter existing reviews)
   */
  const getUserReviews = async (userId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/users/${userId}/reviews`)
      return mapApiResponseToModel(response)
    } catch (err) {
      console.error('Error fetching user reviews:', err)
      error.value = err instanceof Error ? err.message : 'Error fetching reviews'
      return { reviews: [], stats: null }
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    isLoading,
    error,
    updateProfile,
    getUserReviews
  }
}