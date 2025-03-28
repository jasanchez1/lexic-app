import { ref } from 'vue'
import { useMessagingService } from '~/services/api'
import { useAuth } from '~/composables/useAuth'

// Types for the messaging feature
export interface MessageAuthor {
  id: string
  name: string
  title?: string
  imageURL?: string
}

export interface Message {
  id: string
  conversationId: string
  content: string
  timestamp: string
  fromLawyer: boolean
  read: boolean
}

export interface Conversation {
  id: string
  lawyer: {
    id: string
    name: string
    title: string
    imageURL?: string
  }
  lastMessage: string
  lastMessageDate: string
  unreadCount: number
}

export const useMessaging = () => {
  const messagingService = useMessagingService()
  const { isAuthenticated, user } = useAuth()
  
  // State
  const conversations = ref<Conversation[]>([])
  const currentMessages = ref<Message[]>([])
  const isLoadingConversations = ref(false)
  const isLoadingMessages = ref(false)
  const error = ref<string | null>(null)
  
  // Fetch all conversations for the current user
  const fetchConversations = async () => {
    if (!isAuthenticated.value) {
      return []
    }
    
    isLoadingConversations.value = true
    error.value = null
    
    try {
      const response = await messagingService.getConversations()
      conversations.value = response
      return response
    } catch (e) {
      console.error('Error fetching conversations:', e)
      error.value = e instanceof Error ? e.message : 'Error al cargar las conversaciones'
      return []
    } finally {
      isLoadingConversations.value = false
    }
  }
  
  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    if (!isAuthenticated.value) {
      return []
    }
    
    isLoadingMessages.value = true
    error.value = null
    
    try {
      const response = await messagingService.getMessages(conversationId)
      currentMessages.value = response
      return response
    } catch (e) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, e)
      error.value = e instanceof Error ? e.message : 'Error al cargar los mensajes'
      return []
    } finally {
      isLoadingMessages.value = false
    }
  }
  
  // Send a new message in a conversation
  const sendNewMessage = async (conversationId: string, content: string) => {
    if (!isAuthenticated.value || !content.trim()) {
      return null
    }
    
    error.value = null
    
    try {
      const response = await messagingService.sendMessage(conversationId, {
        content,
        user_id: user.value?.id
      })
      
      // Optimistically add the message to the current messages
      currentMessages.value.push({
        id: response.id,
        conversationId,
        content,
        timestamp: new Date().toISOString(),
        fromLawyer: false,
        read: true
      })
      
      // Update conversation's last message in the list
      const conversationIndex = conversations.value.findIndex(c => c.id === conversationId)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].lastMessage = content
        conversations.value[conversationIndex].lastMessageDate = new Date().toISOString()
      }
      
      return response
    } catch (e) {
      console.error(`Error sending message to conversation ${conversationId}:`, e)
      error.value = e instanceof Error ? e.message : 'Error al enviar el mensaje'
      return null
    }
  }
  
  // Mark a conversation as read
  const markConversationAsRead = async (conversationId: string) => {
    if (!isAuthenticated.value) {
      return false
    }
    
    try {
      await messagingService.markAsRead(conversationId)
      
      // Update conversation in local state
      const conversationIndex = conversations.value.findIndex(c => c.id === conversationId)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].unreadCount = 0
      }
      
      // Mark all messages as read
      currentMessages.value = currentMessages.value.map(message => ({
        ...message,
        read: true
      }))
      
      return true
    } catch (e) {
      console.error(`Error marking conversation ${conversationId} as read:`, e)
      error.value = e instanceof Error ? e.message : 'Error al marcar la conversación como leída'
      return false
    }
  }
  
  // Get total unread message count
  const getUnreadCount = async () => {
    if (!isAuthenticated.value) {
      return 0
    }
    
    try {
      return await messagingService.getUnreadCount()
    } catch (e) {
      console.error('Error getting unread count:', e)
      return 0
    }
  }
  
  return {
    conversations,
    currentMessages,
    isLoadingConversations,
    isLoadingMessages,
    error,
    fetchConversations,
    fetchMessages,
    sendNewMessage,
    markConversationAsRead,
    getUnreadCount
  }
}