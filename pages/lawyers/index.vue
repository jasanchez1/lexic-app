<template>
  <div class="min-h-screen bg-white">

    <!-- City Filter -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <h2 class="text-lg font-medium mb-4">Filtrar por Ciudad</h2>
      <div class="flex flex-wrap gap-2">
        <button v-for="city in cities" :key="city"
          class="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100">
          {{ city }}
        </button>
      </div>
    </div>

    <!-- Lawyer Cards -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">52 Abogados Civil con 8 Reseñas</h2>
        <select class="border rounded-md px-3 py-2">
          <option>Mejor coincidencia</option>
          <option>Calificación más alta</option>
          <option>Más experiencia</option>
        </select>
      </div>

      <!-- Example Lawyer Card -->
      <div v-for="lawyer in lawyers" :key="lawyer.id"
        class="border rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
        <NuxtLink :to="`/lawyers/${lawyer.id}`" class="flex">
          <div class="flex">
            <div class="w-32 h-32 flex-shrink-0">
              <img :src="lawyer.imageURL" :alt="lawyer.name" class="rounded-lg w-full h-full object-cover" />
            </div>
            <div class="ml-6 flex-1">
              <div class="flex justify-between">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ lawyer.name }}</h3>
                  <div class="text-sm text-gray-600">{{ lawyer.title }}</div>
                  <div class="flex items-center mt-2">
                    <span class="text-lg font-bold">{{ lawyer.rating }}</span>
                    <div class="flex text-secondary-400 ml-2">
                      {{ '★'.repeat(5) }}
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ lawyer.reviewCount }} reseñas</span>
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <div class="flex items-center mb-2">
                    <span class="font-bold text-lg">{{ lawyer.score }}</span>
                    <button class="ml-4 text-primary-600 hover:text-primary-800">
                      Guardar
                    </button>
                  </div>
                  <div class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
                    Ver Perfil
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <div class="text-sm">
                  <span class="font-medium">Experiencia:</span> {{ lawyer.experience }}
                </div>
                <div class="text-sm mt-1">
                  <span class="font-medium">Áreas:</span> {{ lawyer.areas }}
                </div>
                <p class="mt-2 text-sm text-gray-600 line-clamp-2">
                  {{ lawyer.bio }}
                </p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const cities = [
  'Santiago',
  // 'Valparaíso',
  // 'Concepción',
  // 'Viña del Mar',
  // 'La Serena',
  // 'Antofagasta'
]

const lawyers = [
  {
    id: 1,
    name: 'Garbielito Boric',
    title: 'Abogado Civil Chile',
    rating: 5.0,
    reviewCount: 1,
    score: 7.6,
    experience: '24 años',
    areas: 'Civil, Derecho Personal, Accidentes',
    bio: 'Gabrielito, socio principal de Libbey Law Offices, enfoca su práctica en las áreas de derecho civil...',
    imageURL: 'https://www.cidob.org/sites/default/files/styles/max_width_290/public/gabriel_boric_font.jpg.webp'
  },
]
</script>