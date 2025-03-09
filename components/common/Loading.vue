<template>
    <div :class="['text-center', fullScreen ? 'py-12' : 'py-6']">
      <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500">{{ message }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    message: {
      type: String,
      default: 'Cargando...'
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  })
  </script>