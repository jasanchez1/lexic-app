<script setup lang="ts">
import type { Lawyer } from '~/types/lawyer'

const lawyers = ref<Lawyer[]>([
  {
    id: '1',
    name: 'Garbielito Boric',
    title: 'Abogado Civil Chile',
    reviewScore: 5.0,
    reviewCount: 1,
    professionalStartDate: new Date('2022-09-28T14:30:00Z'),
    areas: ['Civil', 'Derecho Personal', 'Accidentes'],
    bio: 'Gabrielito, socio principal de Libbey Law Offices, enfoca su práctica en las áreas de derecho civil.',
    imageURL:
      'https://www.cidob.org/sites/default/files/styles/max_width_290/public/gabriel_boric_font.jpg.webp',
    phone: '+34673287793',
    city: 'Santiago'
  }
])
const cities = ref<string[]>(['Santiago'])

const handleCitySelect = (city: string) => {
  city
  // Handle city filtering
}

const handleSort = (sortBy: string) => {
  sortBy
  // Handle sorting
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <CommonCityFilter :cities="cities" @select="handleCitySelect" />

    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">
          {{ lawyers.length }} {{ lawyers.length == 1 ? 'Abogado' : 'Abogados' }}
        </h2>
        <CommonSortSelect @sort="handleSort" />
      </div>

      <LawyerCard v-for="lawyer in lawyers" :key="lawyer.id" :lawyer="lawyer" />
    </div>
  </div>
</template>
