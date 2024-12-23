<script setup lang="ts">
const sortOptions = [
  { value: 'best_match', label: 'Mejor coincidencia' },
  { value: 'highest_rating', label: 'Calificación más alta' },
  { value: 'most_experience', label: 'Más experiencia' }
]

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'sort', value: string): void
}>()
</script>

<template>
  <select
    class="border rounded-md px-3 py-2"
    @change="e => emit('sort', (e.target as HTMLSelectElement).value)"
  >
    <option v-for="option in sortOptions" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
