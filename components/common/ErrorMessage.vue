<template>
    <div :class="['rounded-md', fullWidth ? 'w-full' : 'max-w-md mx-auto']">
      <div :class="[`bg-${color}-50 p-4 border border-${color}-200 rounded-md`]">
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Alert icon -->
            <AlertCircle v-if="type === 'error'" 
              :class="[`h-5 w-5 text-${color}-400`]" />
            <AlertTriangle v-else-if="type === 'warning'" 
              :class="[`h-5 w-5 text-${color}-400`]" />
            <Info v-else-if="type === 'info'" 
              :class="[`h-5 w-5 text-${color}-400`]" />
          </div>
          <div class="ml-3">
            <h3 :class="[`text-sm font-medium text-${color}-800`]">
              {{ title }}
            </h3>
            <div v-if="message" :class="[`mt-2 text-sm text-${color}-700`]">
              <p>{{ message }}</p>
            </div>
            <div v-if="$slots.default" :class="[`mt-2 text-sm text-${color}-700`]">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'
  import { computed } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      default: 'error',
      validator: (value: string) => ['error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: 'Ocurrió un error'
    },
    message: {
      type: String,
      default: ''
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  })
  
  const color = computed(() => {
    switch (props.type) {
      case 'error':
        return 'red'
      case 'warning':
        return 'yellow'
      case 'info':
        return 'blue'
      default:
        return 'red'
    }
  })
  </script>