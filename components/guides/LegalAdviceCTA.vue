<template>
    <div class="mt-6">
      <p>
        {{ introText }}
      </p>
      <div class="mt-6 p-4 bg-primary-50 rounded-lg">
        <h4 class="font-semibold mb-2">¿Necesitas asesoría personalizada?</h4>
        <p>
          Nuestros abogados especialistas en {{ areaText }} pueden ayudarte con tu caso particular.
        </p>
        <NuxtLink
          :to="`/lawyers?area=${areaSlug}`"
          class="mt-3 inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Consultar con un Abogado
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    introText: {
      type: String,
      default: 'Realizar este trámite puede ser complejo y abrumador. Contar con el apoyo de un abogado experto puede facilitar el proceso y asegurar que todo se realice correctamente.'
    },
    areaText: {
      type: String,
      required: true
    },
    areaSlug: {
      type: String,
      required: true
    }
  })
  </script>