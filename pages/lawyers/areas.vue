<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Todas las Áreas de Práctica</h1>

    <div class="space-y-12">
      <div v-for="(areas, category) in groupedAreas" :key="category" class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900">
          {{ categories[category] }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="area in areas"
            :key="area.id"
            :to="`/lawyers/area/${area.slug}`"
            class="p-4 rounded-lg border hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h3 class="font-medium text-gray-900">{{ area.name }}</h3>
            <p v-if="area.description" class="mt-1 text-sm text-gray-500">
              {{ area.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLawyerAreas } from '~/composables/useLawyerAreas'

const { groupedAreas, categories } = useLawyerAreas()
</script>
