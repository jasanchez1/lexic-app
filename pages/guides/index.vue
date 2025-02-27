<!-- pages/guides/index.vue -->
<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-primary-800 text-white">
        <div class="max-w-7xl mx-auto px-4 py-12">
          <h1 class="text-3xl font-bold mb-4">Guías Legales</h1>
          <p class="text-xl text-primary-100">
            Recursos completos y detallados sobre temas legales relevantes en Chile
          </p>
        </div>
      </div>
  
      <!-- Guides Grid -->
      <div class="max-w-7xl mx-auto px-4 py-12">
        <!-- Categories Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Categorías</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow text-center">
              <div class="mx-auto w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
                <FileText class="w-8 h-8" />
              </div>
              <h3 class="font-medium">Sucesiones</h3>
            </div>
            
            <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow text-center opacity-50">
              <div class="mx-auto w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
                <Users class="w-8 h-8" />
              </div>
              <h3 class="font-medium">Familia</h3>
            </div>
            
            <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow text-center opacity-50">
              <div class="mx-auto w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
                <Briefcase class="w-8 h-8" />
              </div>
              <h3 class="font-medium">Laboral</h3>
            </div>
            
            <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow text-center opacity-50">
              <div class="mx-auto w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
                <Building class="w-8 h-8" />
              </div>
              <h3 class="font-medium">Inmobiliario</h3>
            </div>
          </div>
        </div>
        
        <!-- Featured Guides -->
        <h2 class="text-2xl font-bold mb-6">Guías Destacadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            to="/guides/posesion-efectiva-chile"
            class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
          >
            <span class="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded mb-4">Sucesiones</span>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-3">
              Guía Completa para la Posesión Efectiva en Chile
            </h3>
            <p class="text-gray-600 mb-4">
              Todo lo que necesitas saber sobre el trámite de posesión efectiva, ya sea testamentaria o intestada. Aprende sobre el proceso, requisitos y costos.
            </p>
            <div class="flex items-center text-sm text-primary-600">
              <span>Ver guía completa</span>
              <ChevronRight class="w-4 h-4 ml-1" />
            </div>
          </NuxtLink>
          
          <!-- Placeholder for future guides -->
          <div class="bg-white rounded-lg shadow-sm border p-6 opacity-50">
            <span class="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded mb-4">Familia</span>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              Guía sobre Divorcios en Chile
            </h3>
            <p class="text-gray-600 mb-4">
              Próximamente: Una guía detallada sobre los procedimientos de divorcio en Chile, causales, requisitos y consideraciones importantes.
            </p>
            <div class="flex items-center text-sm text-gray-400">
              <span>Próximamente</span>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border p-6 opacity-50">
            <span class="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded mb-4">Laboral</span>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              Derechos Laborales: Lo que debes saber
            </h3>
            <p class="text-gray-600 mb-4">
              Próximamente: Guía completa sobre tus derechos como trabajador en Chile, incluye información sobre contratos, despidos y beneficios.
            </p>
            <div class="flex items-center text-sm text-gray-400">
              <span>Próximamente</span>
            </div>
          </div>
        </div>
        
        <!-- Popular Questions -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="divide-y">
              <div class="py-4">
                <h3 class="font-medium text-lg mb-2">¿Cuánto tiempo toma completar una posesión efectiva?</h3>
                <p class="text-gray-600">La posesión efectiva intestada toma entre 30 y 90 días desde su solicitud, mientras que la testamentaria puede variar entre 30 y 60 días dependiendo de la complejidad del caso.</p>
              </div>
              
              <div class="py-4">
                <h3 class="font-medium text-lg mb-2">¿Dónde se realiza el trámite de posesión efectiva?</h3>
                <p class="text-gray-600">La posesión efectiva intestada se realiza en el Registro Civil, mientras que la testamentaria debe tramitarse ante un notario público.</p>
              </div>
              
              <div class="py-4">
                <h3 class="font-medium text-lg mb-2">¿Es necesario contratar un abogado para la posesión efectiva?</h3>
                <p class="text-gray-600">No es obligatorio, pero se recomienda en casos complejos, como cuando hay bienes de alto valor, disputas entre herederos o bienes en el extranjero.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { FileText, Users, Briefcase, Building, ChevronRight } from 'lucide-vue-next'
  </script>