<script setup lang="ts">
defineProps<{
  cities: string[]
}>()

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'select', city: string): void
}>()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h2 class="text-lg font-medium mb-4">Filtrar por Ciudad</h2>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="city in cities"
        :key="city"
        class="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100"
        @click="emit('select', city)"
      >
        {{ city }}
      </button>
    </div>
  </div>
</template>
