<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center h-14">
          <NuxtLink
            to="/guides"
            class="text-primary-100 hover:text-white text-sm transition-colors duration-200"
          >
            Guías Legales
          </NuxtLink>
          <span class="mx-2 text-primary-300">›</span>
          <span class="text-white text-sm">{{ currentGuide?.title || 'Cargando...' }}</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-4xl mx-auto px-4 py-8">
      <CommonLoading message="Cargando guía..." :full-screen="true" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-8">
      <CommonErrorMessage :message="error" full-width />
    </div>

    <!-- Guide content -->
    <div v-else-if="currentGuide" class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        {{ currentGuide.title }}
      </h1>

      <!-- Compact Table of contents -->
      <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div class="flex flex-wrap gap-x-6 gap-y-2">
          <button
            v-for="section in currentGuide.sections"
            :key="section.section_id"
            class="text-primary-600 hover:text-primary-800 hover:underline text-left text-sm font-medium"
            @click="scrollToSection(section.section_id)"
          >
            {{ section.title }}
          </button>
        </div>
      </div>

      <!-- Guide sections -->
      <div class="space-y-6">
        <div
          v-for="section in sortedSections"
          :key="section.section_id"
          :id="section.section_id"
          class="bg-white rounded-lg shadow-sm border overflow-hidden"
        >
          <!-- Section header (always visible) -->
          <button
            class="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
            @click="toggleSection(section)"
          >
            <h2 class="text-xl font-bold text-gray-900">{{ section.title }}</h2>
            <ChevronDown
              v-if="!section.always_open"
              class="w-5 h-5 transition-transform duration-200"
              :class="{ 'rotate-180': openSections.includes(section.id) }"
            />
          </button>

          <!-- Section content (collapsible) -->
          <div v-show="section.always_open || openSections.includes(section.id)" class="px-6 py-4 border-t">
            <div
              class="prose prose-slate prose-ul:list-disc prose-ul:pl-5 max-w-none"
              v-html="section.content"
            ></div>

          </div>
        </div>
      </div>

      <!-- Related guides -->
      <div v-if="currentGuide.related_guides && currentGuide.related_guides.length" class="mt-12">
        <h2 class="text-xl font-bold mb-4">Guías relacionadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink
            v-for="guide in currentGuide.related_guides"
            :key="guide.id"
            :to="`/guides/${guide.slug}`"
            class="bg-white border p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-medium">{{ guide.title }}</h3>
            <p class="text-gray-600 text-sm">
              {{ guide.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useGuides } from '~/composables/useGuides'

const props = defineProps<{
  slug: string
}>()

const { currentGuide, isLoading, error, fetchGuideBySlug } = useGuides()
const openSections = ref<string[]>([])

// Get and sort sections
const sortedSections = computed(() => {
  if (!currentGuide.value) return []
  return [...currentGuide.value.sections].sort((a, b) => a.display_order - b.display_order)
})

// Function to toggle a section's open state
const toggleSection = (section: any) => {
  if (section.always_open) return

  const index = openSections.value.indexOf(section.id)
  if (index === -1) {
    openSections.value.push(section.id)
  } else {
    openSections.value.splice(index, 1)
  }
}

// Function to scroll to a specific section
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    
    // Find and open the section if it's not the always open section
    const section = currentGuide.value?.sections.find(s => s.section_id === sectionId)
    if (section && !section.always_open && !openSections.value.includes(section.id)) {
      openSections.value.push(section.id)
    }
  }
}

onMounted(async () => {
  await fetchGuideBySlug(props.slug)
})
</script>

<style>
/* Add some additional styling for the prose content */
.prose h3 {
  color: #1f2937;
}

.prose ul {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  list-style-type: disc;
  padding-left: 1.5rem;
}

.prose li {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.prose p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>