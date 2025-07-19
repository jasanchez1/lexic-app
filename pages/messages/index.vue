<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold">Mis Mensajes</h1>
        <p class="text-primary-100">Conversaciones con abogados</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="authLoading || isLoadingConversations" class="text-center py-12">
        <CommonLoading message="Cargando conversaciones..." />
      </div>

      <div v-else-if="!isAuthenticated" class="bg-white rounded-lg shadow p-8 text-center">
        <p class="text-gray-600 mb-4">Debes iniciar sesión para ver tus mensajes</p>
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

      <div v-else-if="error" class="mb-6">
        <CommonErrorMessage :message="error" />
      </div>

      <div v-else-if="conversations.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <h2 class="text-xl font-medium text-gray-900 mb-4">No tienes mensajes</h2>
        <p class="text-gray-600 mb-6">Aún no has iniciado conversaciones con abogados</p>
        <NuxtLink 
          to="/lawyers" 
          class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          Buscar Abogados
        </NuxtLink>
      </div>

      <div v-else class="grid md:grid-cols-12 gap-6">
        <!-- Conversations List (sidebar) -->
        <div class="md:col-span-4 lg:col-span-3 bg-white rounded-lg shadow overflow-hidden">
          <div class="p-4 border-b">
            <h2 class="font-medium">Conversaciones</h2>
          </div>
          <div class="divide-y max-h-[70vh] overflow-y-auto">
            <button
              v-for="conversation in conversations"
              :key="conversation.id"
              class="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              :class="{ 'bg-primary-50': selectedConversation?.id === conversation.id }"
              @click="selectConversation(conversation)"
            >
              <div class="flex items-center">
                <div v-if="conversation.other_participant.image_url" class="mr-3">
                  <img
                    :src="conversation.other_participant.image_url"
                    :alt="conversation.other_participant.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div v-else class="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                  {{ getInitials(conversation.other_participant.name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-baseline">
                    <p class="font-medium truncate">{{ conversation.other_participant.name }}</p>
                    <span class="text-xs text-gray-500">{{ formatDate(conversation.last_message_date) }}</span>
                  </div>
                  <p class="text-sm text-gray-500 truncate">
                    {{ conversation.last_message }}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Conversation Detail -->
        <div class="md:col-span-8 lg:col-span-9">
          <div v-if="!selectedConversation" class="bg-white rounded-lg shadow p-8 text-center h-full flex flex-col items-center justify-center">
            <div class="text-gray-400 mb-4">
              <MessageCircle class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-2">Selecciona una conversación</h3>
            <p class="text-gray-600">Elige una conversación de la lista para ver los mensajes</p>
          </div>

          <div v-else class="bg-white rounded-lg shadow h-full flex flex-col">
            <!-- Conversation Header -->
            <div class="p-4 border-b flex items-center justify-between">
              <div class="flex items-center">
                <div v-if="selectedConversation.other_participant.image_url" class="mr-3">
                  <img
                    :src="selectedConversation.other_participant.image_url"
                    :alt="selectedConversation.other_participant.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div v-else class="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                  {{ getInitials(selectedConversation.other_participant.name) }}
                </div>
                <div>
                  <h3 class="font-medium">{{ selectedConversation.other_participant.name }}</h3>
                  <p class="text-xs text-gray-500">{{ selectedConversation.other_participant.title }}</p>
                </div>
              </div>
              <NuxtLink 
                :to="`/lawyers/${selectedConversation.other_participant.id}`" 
                class="text-primary-600 text-sm hover:text-primary-800"
              >
                Ver Perfil
              </NuxtLink>
            </div>

            <!-- Messages List -->
            <div 
              ref="messagesContainer"
              class="flex-1 p-4 overflow-y-auto flex flex-col gap-4"
              style="max-height: 60vh;"
            >
              <div v-if="isLoadingMessages" class="text-center py-4">
                <div class="inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>

              <template v-else>
                <div v-for="(message, index) in currentMessages" :key="message.id" class="flex flex-col">
                  <!-- Date separator if needed -->
                  <div 
                    v-if="index === 0 || shouldShowDateSeparator(message, currentMessages[index - 1])" 
                    class="text-center my-2"
                  >
                    <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {{ formatMessageDate(message.timestamp) }}
                    </span>
                  </div>

                  <!-- Message bubble -->
                  <div 
                    class="max-w-[75%] rounded-lg p-3 mb-1"
                    :class="[
                      message.is_from_me ? 
                        'bg-primary-100 self-end' : 
                        'bg-white border border-gray-200 self-start'
                    ]"
                  >
                    {{ message.content }}
                  </div>

                  <!-- Timestamp -->
                  <div 
                    class="text-xs text-gray-500 mb-2"
                    :class="[message.is_from_me ? 'self-end' : 'self-start']"
                  >
                    {{ formatMessageTime(message.timestamp) }}
                  </div>
                </div>
              </template>
            </div>

            <!-- Message Input -->
            <div class="p-4 border-t">
              <div class="flex gap-2">
                <textarea
                  v-model="newMessage"
                  placeholder="Escribe un mensaje..."
                  class="flex-1 resize-none rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  rows="2"
                  @keypress.enter.exact.prevent="sendMessage"
                ></textarea>
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                  class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useMessaging, type Message } from '~/composables/useMessaging'
import { formatDate } from '~/utils/date'

// Auth state
const { isAuthenticated, authLoading } = useAuth()
const showAuthModal = ref(false)

const { 
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
} = useMessaging()

const selectedConversation = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)

const selectConversation = async (conversation) => {
  selectedConversation.value = conversation
  
  newMessage.value = ''
  
  if (conversation) {
    await fetchMessages(conversation.id)
    await markConversationAsRead(conversation.id)
    
    await nextTick()
    scrollToBottom()
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return
  
  await sendNewMessage(selectedConversation.value.id, newMessage.value)
  newMessage.value = ''
  
  await nextTick()
  scrollToBottom()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substr(0, 2)
    .toUpperCase()
}

// Format message date for display
const formatMessageDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoy'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer'
  } else {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }
}

// Format message time for display
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

// Determine if we should show a date separator
const shouldShowDateSeparator = (currentMessage: Message, previousMessage: Message) => {
  const currentDate = new Date(currentMessage.timestamp).toDateString()
  const previousDate = new Date(previousMessage.timestamp).toDateString()
  return currentDate !== previousDate
}

// Handle login success
const handleLogin = () => {
  showAuthModal.value = false
  // Refresh conversations after login
  fetchConversations()
}

// Watch for messages and scroll to bottom when they change
watch(currentMessages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Handle opening conversation from URL parameter or notification
const handleOpenConversation = (conversationId: string) => {
  const conversation = conversations.value.find(c => c.id === conversationId)
  if (conversation) {
    selectConversation(conversation)
  }
}

// Listen for the global event to open a conversation
onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchConversations()
    
    // Check URL parameter for conversation to open
    const route = useRoute()
    if (route.query.conversation) {
      const conversationId = route.query.conversation
      // Wait a bit for conversations to load
      setTimeout(() => {
        handleOpenConversation(conversationId)
      }, 300)
    }
    // Select first conversation if there are any and no specific one is requested
    else if (conversations.value.length > 0) {
      selectConversation(conversations.value[0])
    }
    
    // Listen for the global event
    if (typeof window !== 'undefined') {
      window.addEventListener('open-conversation', (event: Event) => {
        const { conversationId } = (event as CustomEvent).detail
        handleOpenConversation(conversationId)
      })
    }
  }
})

// Remove event listener on unmount
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('open-conversation', () => {})
  }
})
</script>