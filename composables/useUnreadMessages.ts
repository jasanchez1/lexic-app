import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useMessagingService } from '~/services/api'
import { useAuth } from '~/composables/useAuth'

export const useUnreadMessages = () => {
  const messagingService = useMessagingService()
  const { isAuthenticated } = useAuth()
  
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Computed property to check if there are any unread messages
  const hasUnreadMessages = computed(() => unreadCount.value > 0)
  
  // Fetch unread message count
  const fetchUnreadCount = async () => {
    if (!isAuthenticated.value) {
      unreadCount.value = 0
      return 0
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const count = await messagingService.getUnreadCount()
      unreadCount.value = count
      return count
    } catch (e) {
      console.error('Error fetching unread message count:', e)
      error.value = e instanceof Error ? e.message : 'Error al obtener mensajes no leídos'
      return 0
    } finally {
      isLoading.value = false
    }
  }
  
  // Polling interval for checking unread messages (every 30 seconds)
  let pollingInterval: NodeJS.Timeout | null = null
  
  // Start polling for unread messages
  const startPolling = () => {
    if (pollingInterval) return
    
    // Initial fetch
    fetchUnreadCount()
    
    // Set up interval
    pollingInterval = setInterval(() => {
      fetchUnreadCount()
    }, 30000) // 30 seconds
  }
  
  // Stop polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }
  
  // Setup and cleanup
  onMounted(() => {
    if (isAuthenticated.value) {
      startPolling()
    }
  })
  
  onUnmounted(() => {
    stopPolling()
  })
  
  // Watch for authentication changes
  watch(() => isAuthenticated.value, (newValue) => {
    if (newValue) {
      startPolling()
    } else {
      stopPolling()
      unreadCount.value = 0
    }
  })
  
  return {
    unreadCount,
    hasUnreadMessages,
    isLoading,
    error,
    fetchUnreadCount
  }
}