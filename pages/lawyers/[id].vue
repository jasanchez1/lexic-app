<!-- pages/lawyers/[id].vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Breadcrumb -->
    <div class="mb-6 text-sm">
      <NuxtLink to="/" class="text-primary-600 hover:text-primary-800">Inicio</NuxtLink>
      <span class="mx-2 text-gray-500">/</span>
      <NuxtLink to="/lawyers" class="text-primary-600 hover:text-primary-800">Abogados</NuxtLink>
      <span class="mx-2 text-gray-500">/</span>
      <span class="text-gray-600">{{ lawyer.name }}</span>
    </div>
    </div>
  
    <div class="max-w-7xl mx-auto px-4 pb-6">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Profile Image -->
          <div class="w-32 h-32 flex-shrink-0">
            <img 
              :src="lawyer.imageURL"
              alt="Foto de perfil del abogado"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
  
          <!-- Profile Info -->
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ lawyer.name }}</h1>
                <p class="text-gray-600">también conocido como {{ lawyer.alias }}</p>
                
                <div class="mt-2 flex items-center space-x-2">
                  <span class="text-lg font-semibold">4.3</span>
                  <div class="flex text-yellow-400">
                    <Icon v-for="i in 5" :key="i" 
                      name="lucide:star" 
                      :class="i <= 4 ? 'fill-current' : 'fill-current text-gray-300'"
                      class="w-5 h-5" 
                    />
                  </div>
                  <span class="text-gray-600">6 reseñas</span>
                  <span class="text-gray-400">|</span>
                  <span class="flex items-center">
                    <span class="font-semibold">Calificación:</span>
                    <span class="ml-1">10.0</span>
                  </span>
                </div>
  
                <div class="mt-4 space-y-2">
                  <p class="flex items-center text-gray-600">
                    <span class="font-medium mr-2">Licenciado por:</span>
                    10 años
                  </p>
                  <p class="flex items-center text-gray-600">
                    <Icon name="lucide:map-pin" class="w-4 h-4 mr-2" />
                    {{ lawyer.address }}
                  </p>
                </div>
              </div>
  
              <div class="flex flex-col gap-2">
                <button class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center">
                  <Icon name="lucide:mail" class="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
  
      <!-- Tab Content -->
      <div class="bg-white rounded-lg shadow">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="p-6">
          <h2 class="text-xl font-bold mb-4">Sobre {{ lawyer.name }}</h2>
          <div class="prose max-w-none">
            <p class="text-gray-600">{{ lawyer.bio }}</p>
          </div>
  
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Áreas de Práctica</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="area in lawyer.practiceAreas" :key="area.name" class="flex items-center justify-between">
                <span>{{ area.name }}</span>
                <div class="w-48 bg-gray-200 rounded-full h-2">
                  <div class="bg-primary-500 h-2 rounded-full" :style="{ width: `${area.percentage}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Reseñas de Clientes</h2>
            <button class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
              Escribir Reseña
            </button>
          </div>
        </div>
  
        <!-- Experience Tab -->
        <div v-if="activeTab === 'experience'" class="p-6">
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <div class="flex items-center justify-between">
              <span class="font-semibold">Calificación:</span>
              <span>10.0 (Excelente)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const route = useRoute()
  const lawyerId = route.params.id
  
  const tabs = [
    { id: 'overview', name: 'Resumen' },
    { id: 'reviews', name: 'Reseñas' },
    { id: 'experience', name: 'Experiencia' }
  ]
  
  const lawyer = ref({
    id: lawyerId,
    name: 'Gabrielito Boric',
    imageURL: 'https://www.cidob.org/sites/default/files/styles/max_width_290/public/gabriel_boric_font.jpg.webp',
    alias: 'Alexander I. Passo',
    rating: 4.3,
    reviews: 6,
    rating: 10.0,
    licensedYears: 10,
    address: '73 Ski Hill Rd., Ogden Dunes, IN, 46368',
    bio: 'Gabrielito Boric representa a clientes en una variedad de asuntos con especial énfasis en: disputas comerciales internas, litigios comerciales de emergencia, negligencia legal, infracciones contractuales y más...',
    practiceAreas: [
      { name: 'Otros', percentage: 9 },
      { name: 'Bancario', percentage: 7 },
      { name: 'Negocios', percentage: 7 },
      { name: 'Contratos y Acuerdos', percentage: 7 }
    ]
  })
  
  const activeTab = ref('overview')
  </script>