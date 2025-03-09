<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  initialValue: {
    type: String,
    default: 'best_match'
  },
  options: {
    type: Array,
    default: () => [
      { value: 'best_match', label: 'Mejor coincidencia' },
      { value: 'highest_rating', label: 'Calificación más alta' },
      { value: 'most_experience', label: 'Más experiencia' }
    ]
  }
})

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'sort', value: string): void
}>()

const selectedValue = ref(props.initialValue)

// Watch for external changes to initialValue
watch(() => props.initialValue, (newValue) => {
  selectedValue.value = newValue
})

const handleChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  selectedValue.value = value
  emit('sort', value)
}
</script>

<template>
  <select
    v-model="selectedValue"
    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow px-3 py-2"
    @change="handleChange"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>