<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = defineProps<{
  score: number
  reviewCount?: number
  showScore?: boolean
  useIcons?: boolean
  reviewsUrl?: string
}>()

const getStarPercent = (position: number) => {
  const percent = Math.min(Math.max((props.score - (position - 1)) * 100, 0), 100)
  return percent
}
</script>

<template>
  <div class="flex items-center">
    <span v-if="showScore" class="text-lg font-bold mr-2">{{ score.toFixed(1) }}</span>
    <div class="flex">
      <div v-for="i in 5" :key="i" class="relative">
        <Star class="w-4 h-4 text-gray-300 fill-gray-300" />

        <div class="absolute inset-0 overflow-hidden" :style="{ width: `${getStarPercent(i)}%` }">
          <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>
    </div>
    <NuxtLink v-if="reviewsUrl" :to="reviewsUrl">
      <span
        v-if="reviewCount"
        class="ml-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
      >
        {{ reviewCount }} {{ reviewCount === 1 ? 'reseña' : 'reseñas' }}
      </span>
    </NuxtLink>
    <div v-else>
      <span v-if="reviewCount" class="ml-2 text-sm text-gray-600">
        {{ reviewCount }} {{ reviewCount === 1 ? 'reseña' : 'reseñas' }}
      </span>
    </div>
  </div>
</template>
