import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMessagingService } from '~/services/api'
import { useNotifications } from '~/composables/useNotifications'
import { useAuth } from '~/composables/useAuth'
import type { Conversation } from '~/composables/useMessaging'

// Store the last checked timestamp to keep track of new messages
const lastCheckedTimestamps = ref<Record<string, string>>({})

export const useMessageNotifications = () => {
  const messagingService = useMessagingService()
  const { isAuthenticated } = useAuth()
  const { message } = useNotifications()
  const router = useRouter()
  
  // Track if we are already on the messages page
  const isOnMessagesPage = computed(() => {
    return router.currentRoute.value.path.includes('/messages')
  })
  
  // Function to check for new messages
  const checkForNewMessages = async () => {
    if (!isAuthenticated.value || isOnMessagesPage.value) {
      return
    }
    
    try {
      const conversations = await messagingService.getConversations()
      
      // Process each conversation to see if there are new messages
      conversations.forEach(conversation => {
        const lastChecked = lastCheckedTimestamps.value[conversation.id]
        
        // If we have a new message since last check
        if (
          !lastChecked || new Date(conversation.last_message_date) > new Date(lastChecked)
        ) {
          // Show notification for new message
          showNewMessageNotification(conversation)
          
          // Update the last checked timestamp for this conversation
          lastCheckedTimestamps.value[conversation.id] = new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Error checking for new messages:', error)
    }
  }
  
  // Show notification for a new message
  const showNewMessageNotification = (conversation: Conversation) => {
    const title = `Nuevo mensaje de ${conversation.other_participant.name}`
    const messageText = conversation.last_message
    
    // Show notification with action to navigate to messages
    message(
      title,
      messageText,
      {
        duration: 10000, // 10 seconds
        action: () => router.push('/messages'),
        actionText: 'Ver mensaje'
      }
    )
  }
  
  // Polling interval for checking new messages (every 30 seconds)
  let pollingInterval: NodeJS.Timeout | null = null
  
  // Start polling for new messages
  const startPolling = () => {
    if (pollingInterval) return
    
    // Initial check
    checkForNewMessages()
    
    // Set up interval (every 30 seconds)
    pollingInterval = setInterval(() => {
      checkForNewMessages()
    }, 30000)
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
    }
  })
  
  return {
    checkForNewMessages,
    startPolling,
    stopPolling
  }
}