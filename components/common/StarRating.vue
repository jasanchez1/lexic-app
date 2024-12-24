<template>
  <div class="flex items-center">
    <span v-if="showScore" class="text-lg font-bold mr-2">{{ score }}</span>
    <div class="flex">
      <Star
        v-for="i in 5"
        :key="i"
        :class="[
          'w-4 h-4',
          i <= score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
        ]"
      />
    </div>
    <span v-if="reviewCount" class="ml-2 text-sm text-gray-600">
      {{ reviewCount }} {{ reviewCount === 1 ? 'reseña' : 'reseñas' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next'
defineProps<{
  score: number
  reviewCount?: number
  showScore?: boolean
  useIcons?: boolean
}>()
</script>
