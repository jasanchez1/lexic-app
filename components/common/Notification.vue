<template>
    <Transition name="notification-fade">
      <div 
        v-if="show"
        class="fixed z-50 bottom-5 right-5 p-4 rounded-lg shadow-lg max-w-md w-full bg-white border-l-4"
        :class="[typeClasses]"
        role="alert"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 mr-3">
            <!-- Success icon -->
            <CheckCircle v-if="type === 'success'" class="h-5 w-5 text-green-500" />
            
            <!-- Info icon -->
            <Info v-else-if="type === 'info'" class="h-5 w-5 text-blue-500" />
            
            <!-- Warning icon -->
            <AlertTriangle v-else-if="type === 'warning'" class="h-5 w-5 text-amber-500" />
            
            <!-- Error icon -->
            <AlertCircle v-else-if="type === 'error'" class="h-5 w-5 text-red-500" />
            
            <!-- Default message icon -->
            <MessageSquare v-else class="h-5 w-5 text-primary-500" />
          </div>
          
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h3 class="text-sm font-medium" :class="[textColorClass]">
                {{ title }}
              </h3>
              <button 
                @click="closeNotification" 
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            
            <div v-if="message" :class="[`mt-1 text-sm text-gray-600`]">
              {{ message }}
            </div>
            
            <div v-if="$slots.default" :class="[`mt-1 text-sm text-gray-600`]">
              <slot></slot>
            </div>
            
            <div v-if="action" class="mt-2">
              <button 
                @click="handleAction" 
                class="text-sm font-medium"
                :class="[actionColorClass]"
              >
                {{ actionText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { 
    CheckCircle, 
    Info, 
    AlertTriangle, 
    AlertCircle, 
    MessageSquare,
    X 
  } from 'lucide-vue-next'
  
  type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'message'
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String as () => NotificationType,
      default: 'info'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 5000 // 5 seconds by default
    },
    action: {
      type: Function,
      default: null
    },
    actionText: {
      type: String,
      default: 'Ver'
    }
  })
  
  const emit = defineEmits(['close', 'action'])
  
  // Calculate border and text color based on notification type
  const typeClasses = computed(() => {
    switch (props.type) {
      case 'success':
        return 'border-green-500'
      case 'info':
        return 'border-blue-500'
      case 'warning':
        return 'border-amber-500'
      case 'error':
        return 'border-red-500'
      default:
        return 'border-primary-500'
    }
  })
  
  // Calculate text color for title based on notification type
  const textColorClass = computed(() => {
    switch (props.type) {
      case 'success':
        return 'text-green-800'
      case 'info':
        return 'text-blue-800'
      case 'warning':
        return 'text-amber-800'
      case 'error':
        return 'text-red-800'
      default:
        return 'text-primary-800'
    }
  })
  
  // Calculate action button color based on notification type
  const actionColorClass = computed(() => {
    switch (props.type) {
      case 'success':
        return 'text-green-600 hover:text-green-800'
      case 'info':
        return 'text-blue-600 hover:text-blue-800'
      case 'warning':
        return 'text-amber-600 hover:text-amber-800'
      case 'error':
        return 'text-red-600 hover:text-red-800'
      default:
        return 'text-primary-600 hover:text-primary-800'
    }
  })
  
  // Auto-close after duration if duration is > 0
  if (props.duration > 0) {
    setTimeout(() => {
      closeNotification()
    }, props.duration)
  }
  
  // Close the notification
  function closeNotification() {
    emit('close')
  }
  
  // Handle the action button click
  function handleAction() {
    if (props.action) {
      props.action()
    }
    emit('action')
  }
  </script>
  
  <style scoped>
  .notification-fade-enter-active,
  .notification-fade-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-fade-enter-from,
  .notification-fade-leave-to {
    transform: translateY(30px);
    opacity: 0;
  }
  </style>