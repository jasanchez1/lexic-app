<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-primary-800 text-white">
        <div class="max-w-7xl mx-auto px-4 py-12">
          <h1 class="text-3xl font-bold mb-4">Guías Legales</h1>
          <p class="text-xl text-primary-100">
            Recursos y guías completas sobre diversos temas legales en Chile.
          </p>
        </div>
      </div>
  
      <!-- Guides Grid -->
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            to="/guides/posesion-efectiva-chile"
            class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
          >
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
              Guía Completa para la Posesión Efectiva en Chile
            </h3>
            <p class="mt-2 text-gray-600">
              Todo lo que necesitas saber sobre el trámite de posesión efectiva, ya sea testamentaria o intestada.
            </p>
            <div class="mt-4 flex items-center text-sm text-primary-600">
              Ver guía completa →
            </div>
          </NuxtLink>
          
          <!-- Placeholder for future guides -->
          <div class="bg-white rounded-lg shadow-sm border p-6 opacity-50">
            <h3 class="text-lg font-semibold text-gray-900">
              Guía sobre Divorcios en Chile
            </h3>
            <p class="mt-2 text-gray-600">
              Próximamente: Una guía detallada sobre los procedimientos de divorcio en Chile.
            </p>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border p-6 opacity-50">
            <h3 class="text-lg font-semibold text-gray-900">
              Derechos Laborales: Lo que debes saber
            </h3>
            <p class="mt-2 text-gray-600">
              Próximamente: Guía completa sobre tus derechos como trabajador en Chile.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // No additional logic needed for this page
  </script>