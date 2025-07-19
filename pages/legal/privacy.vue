<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
        <p class="text-xl text-gray-600">Cómo protegemos y manejamos su información personal</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="prose max-w-none">
          <div class="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
            <p class="text-primary-800 font-medium mb-4">
              Nuestra política de privacidad completa está disponible en el documento oficial actualizado.
            </p>
            <a 
              href="/Politica_Privacidad_Lexic 16.06.2025.docx" 
              download
              class="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Descargar Política de Privacidad
            </a>
          </div>

          <div class="space-y-8">
            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Recopilación de Información</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                En Lexic recopilamos únicamente la información necesaria para brindar nuestros servicios de asesoría legal:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>Información de registro (nombre, email, teléfono)</li>
                <li>Consultas y comunicaciones legales</li>
                <li>Información de uso de la plataforma</li>
                <li>Datos necesarios para verificación de abogados</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Uso de la Información</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Su información se utiliza exclusivamente para:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>Facilitar la conexión con abogados apropiados</li>
                <li>Mejorar nuestros servicios</li>
                <li>Enviar comunicaciones relevantes sobre su consulta</li>
                <li>Cumplir con requisitos legales</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Protección de Datos</h2>
              <div class="bg-blue-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-blue-900 mb-3">Medidas de Seguridad</h3>
                <ul class="list-disc list-inside text-blue-800 space-y-2">
                  <li>Encriptación de datos en tránsito y en reposo</li>
                  <li>Acceso restringido a información personal</li>
                  <li>Auditorías regulares de seguridad</li>
                  <li>Cumplimiento con estándares internacionales</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Sus Derechos</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Usted tiene derecho a:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>Acceder a su información personal</li>
                <li>Solicitar corrección de datos inexactos</li>
                <li>Solicitar eliminación de sus datos</li>
                <li>Restringir el procesamiento de su información</li>
                <li>Portabilidad de datos</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Consentimiento para Tratamiento de Datos</h2>
              <div class="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <p class="text-primary-800 font-medium mb-4">
                  Para obtener información detallada sobre el consentimiento para el tratamiento de datos personales, consulte nuestro documento específico:
                </p>
                <a 
                  href="/Consentimiento_Tratamiento_Datos.docx" 
                  download
                  class="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Consentimiento de Datos
                </a>
              </div>
            </section>

            <div class="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Contacto</h3>
              <p class="text-gray-700 mb-4">
                Para consultas sobre privacidad o ejercer sus derechos, puede contactarnos a través de la plataforma.
              </p>
              <p class="text-sm text-gray-600">
                Última actualización: Junio 16, 2025
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
  title: 'Política de Privacidad - Lexic',
  meta: [
    {
      name: 'description',
      content: 'Política de privacidad de Lexic - Cómo protegemos y manejamos su información personal en nuestra plataforma de asesoría legal.'
    }
  ]
})
</script>