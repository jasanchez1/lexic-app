<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-4">Guías Legales</h1>
        <p class="text-xl text-primary-100 mb-6">
          Recursos completos y detallados sobre temas legales relevantes en Chile
        </p>
        <p class="text-primary-100 max-w-4xl">
          En este espacio, ponemos a tu disposición una amplia variedad de artículos legales
          diseñados para hacer que el conocimiento jurídico sea accesible para todos. Nuestro
          objetivo es brindarte información clara y útil sobre tus derechos y obligaciones, así como
          mantenerte al día con las últimas novedades legales.
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
            <div
              class="mx-auto w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4"
            >
              <FileText class="w-8 h-8" />
            </div>
            <h3 class="font-medium">Sucesiones</h3>
          </div>

          <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow text-center">
            <div
              class="mx-auto w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4"
            >
              <Users class="w-8 h-8" />
            </div>
            <h3 class="font-medium">Familia</h3>
          </div>

          <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow text-center">
            <div
              class="mx-auto w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4"
            >
              <Briefcase class="w-8 h-8" />
            </div>
            <h3 class="font-medium">Laboral</h3>
          </div>

          <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow text-center">
            <div
              class="mx-auto w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4"
            >
              <Building class="w-8 h-8" />
            </div>
            <h3 class="font-medium">Inmobiliario</h3>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading">
        <CommonLoading message="Cargando guías..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-6">
        <CommonErrorMessage :message="error" />
      </div>

      <!-- Featured Guides -->
      <template v-else>
        <h2 class="text-2xl font-bold mb-6">Guías Destacadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="guide in guides"
            :key="guide.id"
            :to="`/guides/${guide.slug}`"
            class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
          >
            <span
              class="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded mb-4"
            >
              {{ getCategoryForGuide(guide.slug) }}
            </span>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-3">
              {{ guide.title }}
            </h3>
            <p class="text-gray-600 mb-4">
              {{ guide.description }}
            </p>
            <div class="flex items-center text-sm text-primary-600">
              <span>Ver guía completa</span>
              <ChevronRight class="w-4 h-4 ml-1" />
            </div>
          </NuxtLink>
        </div>
      </template>

      <!-- Popular Questions -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="divide-y">
            <div class="py-4">
              <h3 class="font-medium text-lg mb-2">
                ¿Cuánto tiempo toma completar una posesión efectiva?
              </h3>
              <p class="text-gray-600">
                La posesión efectiva intestada toma entre 30 y 90 días desde su solicitud, mientras
                que la testamentaria puede variar entre 30 y 60 días dependiendo de la complejidad
                del caso.
              </p>
            </div>

            <div class="py-4">
              <h3 class="font-medium text-lg mb-2">
                ¿Es obligación del banco realizar el alzamiento de hipoteca?
              </h3>
              <p class="text-gray-600">
                Sí, según la Ley N° 20.855, es responsabilidad de las entidades financieras realizar
                los trámites de alzamiento una vez que el deudor ha pagado completamente su deuda.
              </p>
            </div>

            <div class="py-4">
              <h3 class="font-medium text-lg mb-2">
                ¿Es necesario contratar un abogado para cambiar mi nombre?
              </h3>
              <p class="text-gray-600">
                No es obligatorio, pero es altamente recomendable para aumentar las probabilidades
                de éxito de tu solicitud, especialmente en casos complejos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Disclaimer Footer -->
  <div class="bg-gray-50 border-t border-gray-200 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <p class="text-sm text-gray-500 italic text-center max-w-4xl mx-auto">
        El contenido de este blog tiene fines informativos y educativos. No constituye asesoramiento
        legal y no debe ser considerado como tal. Recomendamos consultar a un abogado calificado
        para obtener asesoramiento específico sobre tu situación particular. "Lexic" no se hace
        responsable por cualquier acción tomada basada en la información proporcionada en este blog.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { FileText, Users, Briefcase, Building, ChevronRight } from 'lucide-vue-next'
import { useGuides } from '~/composables/useGuides'

// Definition of page meta data
definePageMeta({
  title: 'Guías Legales - Recursos Jurídicos Gratuitos',
  description:
    'Accede a guías legales completas y detalladas sobre posesión efectiva, alzamiento de hipotecas, cambio de nombre y otros temas jurídicos relevantes en Chile.'
})

const { guides, isLoading, error, fetchGuides } = useGuides()

// Helper to categorize guides
const getCategoryForGuide = (slug: string): string => {
  switch (slug) {
    case 'posesion-efectiva-chile':
      return 'Sucesiones'
    case 'alzamiento-hipotecas-chile':
      return 'Inmobiliario'
    case 'cambio-nombre-apellido-chile':
      return 'Civil'
    default:
      return 'Legal'
  }
}

onMounted(async () => {
  await fetchGuides()
})
</script>