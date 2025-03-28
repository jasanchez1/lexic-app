<template>
    <div class="relative">
      <!-- Bell icon with counter -->
      <button 
        @click="toggleNotifications" 
        class="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Notifications"
      >
        <Bell :class="[hasNotifications ? 'text-primary-600' : 'text-gray-600']" />
        
        <!-- Notification counter badge -->
        <span 
          v-if="unreadCount > 0" 
          class="absolute top-0 right-0 flex items-center justify-center bg-red-500 text-white text-xs rounded-full h-5 min-w-[1.25rem] px-1"
        >
          {{ unreadCount < 10 ? unreadCount : '9+' }}
        </span>
      </button>
  
      <!-- Dropdown with notifications -->
      <div 
        v-if="showNotifications" 
        class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
        ref="notificationDropdown"
      >
        <div class="p-3 border-b flex justify-between items-center">
          <h3 class="font-semibold text-gray-700">Notificaciones</h3>
          <div class="flex items-center gap-2">
            <button 
              v-if="hasNotifications" 
              @click="markAllAsRead" 
              class="text-xs text-primary-600 hover:text-primary-800"
            >
              Marcar todo como leído
            </button>
          </div>
        </div>
  
        <!-- Notification list -->
        <div class="divide-y">
          <template v-if="notifications.length > 0">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              class="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="[notification.read ? 'bg-white' : 'bg-blue-50']"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-3">
                  <div v-if="notification.type === 'message'" class="rounded-full p-2 bg-primary-100">
                    <MessageSquare class="h-4 w-4 text-primary-600" />
                  </div>
                  <div v-else class="rounded-full p-2 bg-blue-100">
                    <Bell class="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                  <p class="text-sm text-gray-500 line-clamp-2">{{ notification.content }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.timestamp) }}</p>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Empty state -->
          <div v-else class="p-4 text-center text-gray-500">
            <div class="flex justify-center mb-2">
              <Bell class="h-6 w-6 text-gray-300" />
            </div>
            <p>No tienes notificaciones</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
  import { Bell, MessageSquare } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  import { onClickOutside } from '@vueuse/core'
  import { useMessagingService } from '~/services/api'
  
  interface Notification {
    id: string
    type: 'message' | 'system'
    title: string
    content: string
    timestamp: string
    read: boolean
    action?: () => void
    data?: any
  }
  
  const props = defineProps({
    checkInterval: {
      type: Number,
      default: 30000 // 30 seconds by default
    }
  })
  
  const router = useRouter()
  const messagingService = useMessagingService()
  
  // State
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const showNotifications = ref(false)
  const notificationDropdown = ref(null)
  
  // Computed
  const hasNotifications = computed(() => notifications.value.length > 0)
  
  // Close when clicking outside
  onClickOutside(notificationDropdown, () => {
    showNotifications.value = false
  })
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value
    
    // If opening and there are unread notifications, mark them as read after a delay
    if (showNotifications.value && unreadCount.value > 0) {
      setTimeout(() => {
        markAllAsRead()
      }, 2000)
    }
  }
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    notification.read = true
    
    // Execute action if available
    if (notification.action) {
      notification.action()
    }
    
    // If it's a message notification, navigate to messages
    if (notification.type === 'message' && notification.data?.conversationId) {
      router.push(`/messages?conversation=${notification.data.conversationId}`)
    }
    
    // Close dropdown
    showNotifications.value = false
  }
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
    updateUnreadCount()
  }
  
  // Update unread count
  const updateUnreadCount = () => {
    unreadCount.value = notifications.value.filter(n => !n.read).length
  }
  
  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) {
      return 'Ahora mismo'
    } else if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
    } else {
      return date.toLocaleDateString()
    }
  }
  
  // Check for new messages and create notifications
  const checkForNewMessages = async () => {
    try {
      const conversations = await messagingService.getConversations()
      
      // For each conversation with unread messages
      conversations.forEach(conversation => {
        if (conversation.unreadCount > 0) {
          // Check if we already have a notification for this conversation
          const existingNotification = notifications.value.find(
            n => n.type === 'message' && n.data?.conversationId === conversation.id
          )
          
          // If not, create a new notification
          if (!existingNotification) {
            notifications.value.unshift({
              id: `msg-notification-${Date.now()}`,
              type: 'message',
              title: `Nuevo mensaje de ${conversation.lawyer.name}`,
              content: conversation.lastMessage,
              timestamp: conversation.lastMessageDate,
              read: false,
              action: () => router.push(`/messages?conversation=${conversation.id}`),
              data: {
                conversationId: conversation.id,
                lawyerId: conversation.lawyer.id
              }
            })
          }
        }
      })
      
      // Update unread count
      updateUnreadCount()
    } catch (error) {
      console.error('Error checking for new messages:', error)
    }
  }
  
  // Polling interval for checking new messages
  let checkInterval: NodeJS.Timeout | null = null
  
  // Start polling
  const startPolling = () => {
    // Initial check
    checkForNewMessages()
    
    // Set interval for periodic checks
    checkInterval = setInterval(() => {
      checkForNewMessages()
    }, props.checkInterval)
  }
  
  // Stop polling
  const stopPolling = () => {
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }
  
  // Initialize on mount
  onMounted(() => {
    startPolling()
  })
  
  // Clean up on unmount
  onBeforeUnmount(() => {
    stopPolling()
  })
  
  // Add a test notification (for development)
  const addTestNotification = () => {
    notifications.value.unshift({
      id: `test-notification-${Date.now()}`,
      type: 'system',
      title: 'Test Notification',
      content: 'This is a test notification to verify the notification system is working correctly.',
      timestamp: new Date().toISOString(),
      read: false
    })
    updateUnreadCount()
  }
  
  // Add test notification after 3 seconds (in development mode only)
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      addTestNotification()
    }, 3000)
  }
  
  // Watch notifications for changes to update unread count
  watch(notifications, () => {
    updateUnreadCount()
  }, { deep: true })
  </script>