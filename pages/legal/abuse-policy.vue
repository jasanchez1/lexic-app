<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Políticas Anti-abuso</h1>
        <p class="text-xl text-gray-600">Normas para un uso responsable de la plataforma</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="prose max-w-none">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p class="text-red-800 font-medium mb-4">
              Las políticas completas de prevención de abuso y mal uso están disponibles en el documento oficial.
            </p>
            <a 
              href="/docs/Lexic_Politicas_Antiabuso_Mal Uso 24.06.2025.docx" 
              download
              class="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Descargar Políticas Anti-abuso
            </a>
          </div>

          <div class="space-y-8">
            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Conductas Prohibidas</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Para mantener un entorno seguro y profesional, las siguientes conductas están estrictamente prohibidas:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>Acoso, intimidación o amenazas hacia otros usuarios</li>
                <li>Uso de lenguaje ofensivo, discriminatorio o inapropiado</li>
                <li>Intentos de fraude o estafa</li>
                <li>Violación de la confidencialidad de las consultas</li>
                <li>Suplantación de identidad</li>
                <li>Spam o publicidad no autorizada</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Uso Apropiado de la Plataforma</h2>
              <div class="bg-green-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-green-900 mb-3">Prácticas Recomendadas</h3>
                <ul class="list-disc list-inside text-green-800 space-y-2">
                  <li>Mantener comunicaciones profesionales y respetuosas</li>
                  <li>Proporcionar información precisa en las consultas</li>
                  <li>Respetar los términos de servicio de los abogados</li>
                  <li>Reportar comportamientos inapropiados</li>
                  <li>Proteger la información confidencial</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Sistema de Reportes</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Si experimenta o presencia algún tipo de abuso o mal uso de la plataforma:
              </p>
              <div class="bg-blue-50 rounded-lg p-6">
                <ol class="list-decimal list-inside text-blue-800 space-y-2">
                  <li>Reporte el incidente inmediatamente a través de los canales oficiales</li>
                  <li>Proporcione evidencia del comportamiento inapropiado</li>
                  <li>Evite confrontaciones directas con el usuario infractor</li>
                  <li>Coopere con la investigación si es necesario</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Consecuencias por Violaciones</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Las violaciones a estas políticas pueden resultar en:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>Advertencias formales</li>
                <li>Suspensión temporal de la cuenta</li>
                <li>Suspensión permanente de la plataforma</li>
                <li>Acciones legales cuando corresponda</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Protección de Menores</h2>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-yellow-900 mb-3">Protección Especial</h3>
                <p class="text-yellow-800">
                  Tenemos políticas especiales para la protección de menores de edad. Cualquier contenido o comportamiento que pueda poner en riesgo a menores será tratado con la máxima severidad y reportado a las autoridades correspondientes.
                </p>
              </div>
            </section>

            <div class="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Proceso de Apelación</h3>
              <p class="text-gray-700 mb-4">
                Si considera que una acción disciplinaria fue injusta, puede apelar la decisión siguiendo nuestro proceso formal de apelaciones descrito en el documento completo.
              </p>
              <p class="text-sm text-gray-600">
                Última actualización: Junio 24, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Políticas Anti-abuso - Lexic',
  meta: [
    {
      name: 'description',
      content: 'Políticas de prevención de abuso y mal uso de la plataforma Lexic para mantener un entorno seguro y profesional.'
    }
  ]
})
</script>