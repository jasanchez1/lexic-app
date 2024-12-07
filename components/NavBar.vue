<!-- components/NavBar.vue -->
<template>
    <header>
      <!-- Top Navigation -->
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-gray-900">Logo</NuxtLink>
              <div class="hidden md:flex ml-10 space-x-8">
                <NuxtLink to="/lawyers" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Abogados por Área
                </NuxtLink>
                <NuxtLink to="/questions" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Preguntas Abiertas
                </NuxtLink>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <NuxtLink to="/profile/create" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Crear Perfil
              </NuxtLink>
              <button class="bg-accent-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-accent-700">
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Secondary Navigation (only for lawyer pages) -->
      <div v-if="route.path.includes('/lawyers')" class="bg-primary-800 text-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex items-center h-14">
            <NuxtLink to="/lawyers/search" class="text-primary-100 hover:text-white text-sm">
              Buscar Abogado
            </NuxtLink>
            <span class="mx-2 text-primary-300">›</span>
            <span class="text-white text-sm">Abogados Civil</span>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  const route = useRoute()
  </script>