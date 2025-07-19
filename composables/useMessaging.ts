import { ref } from 'vue'
import { useMessagingService } from '~/services/api'
import { useAuth } from '~/composables/useAuth'
import type { Message } from '~/types/message'

export interface ParticipantData {
  id: string
  name: string
  title?: string
  image_url?: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_from_me: boolean
  read: boolean
  timestamp: string
}

export interface Conversation {
  id: string
  other_participant: ParticipantData
  last_message: string
  last_message_date: string
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
      
      currentMessages.value.push({
        id: response.id,
        conversation_id: conversationId,
        sender_id: user.value?.id || '',
        content,
        is_from_me: true,
        read: true,
        timestamp: new Date().toISOString()
      })
      
      const conversationIndex = conversations.value.findIndex(c => c.id === conversationId)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].last_message = content
        conversations.value[conversationIndex].last_message_date = new Date().toISOString()
      }
      
      return response
    } catch (e) {
      console.error(`Error sending message to conversation ${conversationId}:`, e)
      error.value = e instanceof Error ? e.message : 'Error al enviar el mensaje'
      return null
    }
  }
  
  const markConversationAsRead = async (conversationId: string) => {
    if (!isAuthenticated.value) {
      return false
    }
    
    try {
      await messagingService.markAsRead(conversationId)
      
      currentMessages.value = currentMessages.value.map((message: Message) => ({
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