import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error' | 'message'
  title: string
  message?: string
  duration?: number
  action?: () => void
  actionText?: string
}

// This is a global store for notifications
const notifications = ref<Notification[]>([])

// Maximum number of notifications to show at once
const MAX_NOTIFICATIONS = 3

export const useNotifications = () => {
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = uuidv4()
    
    // Add the notification to the beginning of the array
    notifications.value.unshift({
      id,
      ...notification
    })
    
    // If we exceed the maximum, remove the oldest notifications
    if (notifications.value.length > MAX_NOTIFICATIONS) {
      notifications.value = notifications.value.slice(0, MAX_NOTIFICATIONS)
    }
    
    // Auto-remove after duration if specified
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
    
    return id
  }
  
  // Convenience methods for different notification types
  const success = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 5000,
      ...options
    })
  }
  
  const info = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 5000,
      ...options
    })
  }
  
  const warning = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 7000,
      ...options
    })
  }
  
  const error = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 10000,
      ...options
    })
  }
  
  const message = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'message',
      title,
      message,
      duration: 5000,
      ...options
    })
  }
  
  // Remove a specific notification by ID
  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }
  
  // Clear all notifications
  const clearNotifications = () => {
    notifications.value = []
  }
  
  return {
    notifications,
    addNotification,
    success,
    info,
    warning,
    error,
    message,
    removeNotification,
    clearNotifications
  }
}