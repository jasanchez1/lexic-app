<template>
    <div class="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-2 items-end">
      <CommonNotification
        v-for="notification in notifications"
        :key="notification.id"
        :show="true"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        :duration="notification.duration"
        :action="notification.action"
        :action-text="notification.actionText"
        @close="removeNotification(notification.id)"
        @action="handleAction(notification)"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useNotifications } from '~/composables/useNotifications'
  
  const { notifications, removeNotification } = useNotifications()
  
  // Handle notification action click
  const handleAction = (notification: any) => {
    if (notification.action) {
      notification.action()
    }
    removeNotification(notification.id)
  }
  </script>