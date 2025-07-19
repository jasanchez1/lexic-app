<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
        <p class="text-xl text-gray-600">Condiciones de uso de la plataforma Lexic</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="prose max-w-none">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p class="text-blue-800 font-medium mb-4">
              Los términos y condiciones completos están disponibles en el documento oficial actualizado.
            </p>
            <a 
              href="/docs/Lexic TyC_24.06.2025.docx" 
              download
              class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Descargar Términos y Condiciones
            </a>
          </div>

          <div class="space-y-8">
            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
              <p class="text-gray-700 leading-relaxed">
                Al acceder y utilizar la plataforma Lexic, usted acepta estar sujeto a estos términos y condiciones de uso, así como a todas las leyes y regulaciones aplicables.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Descripción del Servicio</h2>
              <p class="text-gray-700 leading-relaxed">
                Lexic es una plataforma digital que facilita la conexión entre usuarios que buscan asesoría legal y abogados licenciados y verificados.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidades del Usuario</h2>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>Proporcionar información veraz y actualizada</li>
                <li>Respetar la confidencialidad de las consultas</li>
                <li>No utilizar la plataforma para actividades ilegales</li>
                <li>Cumplir con las políticas de uso apropiado</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Limitaciones de Responsabilidad</h2>
              <p class="text-gray-700 leading-relaxed">
                Lexic actúa como intermediario entre usuarios y abogados. La responsabilidad por la asesoría legal proporcionada recae exclusivamente en el profesional legal correspondiente.
              </p>
            </section>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h3 class="text-lg font-semibold text-yellow-800 mb-3">Documento Completo</h3>
              <p class="text-yellow-700 mb-4">
                Este es un resumen de los términos y condiciones. Para consultar el documento completo y actualizado, por favor descargue el archivo oficial.
              </p>
              <p class="text-sm text-yellow-600">
                Última actualización: Junio 24, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
useHead({
  title: 'Términos y Condiciones - Lexic',
  meta: [
    {
      name: 'description',
      content: 'Términos y condiciones de uso de la plataforma Lexic para servicios de asesoría legal.'
    }
  ]
})
</script>