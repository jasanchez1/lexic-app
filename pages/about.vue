<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Acerca de Lexic</h1>
        <p class="text-xl text-gray-600">Nuestra misión, visión y valores</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="prose max-w-none">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p class="text-blue-800 font-medium mb-4">
              Información completa sobre nuestra empresa, misión y valores está disponible en el
              documento oficial.
            </p>
            <a
              href="/Lexic_Nosotros_Mision_Valores.pdf"
              download
              class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Descargar Información Completa
            </a>
          </div>

          <div class="space-y-8">
            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
              <div class="bg-primary-50 rounded-lg p-6">
                <p class="text-primary-800 text-lg leading-relaxed">
                  Democratizar el acceso a la asesoría legal de calidad, conectando a personas y
                  empresas con abogados especializados a través de una plataforma digital segura,
                  transparente y eficiente.
                </p>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
              <div class="bg-primary-50 rounded-lg p-6">
                <p class="text-green-800 text-lg leading-relaxed">
                  Ser la plataforma líder en asesoría legal digital, transformando la manera en que
                  las personas acceden a servicios jurídicos, haciendo que la justicia sea más
                  accesible para todos.
                </p>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">Confianza</h3>
                  <p class="text-gray-700">
                    Verificamos a todos nuestros abogados y garantizamos la confidencialidad en cada
                    consulta.
                  </p>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">Transparencia</h3>
                  <p class="text-gray-700">
                    Precios claros, procesos transparentes y comunicación directa entre usuarios y
                    abogados.
                  </p>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">Eficiencia</h3>
                  <p class="text-gray-700">
                    Conectamos rápidamente a usuarios con el abogado más adecuado para su caso
                    específico.
                  </p>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">Excelencia</h3>
                  <p class="text-gray-700">
                    Comprometidos con la calidad en cada aspecto de nuestro servicio y atención al
                    cliente.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Por qué Lexic?</h2>
              <div class="space-y-4">
                <div class="flex items-start space-x-4">
                  <div
                    class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-primary-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Acceso Inmediato</h3>
                    <p class="text-gray-700">
                      Obtén asesoría legal cuando la necesites, sin citas ni esperas prolongadas.
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div
                    class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-primary-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Abogados Verificados</h3>
                    <p class="text-gray-700">
                      Todos nuestros profesionales están licenciados y han pasado nuestro proceso de
                      verificación.
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div
                    class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-primary-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Especialización</h3>
                    <p class="text-gray-700">
                      Encuentra abogados especializados en el área específica que necesitas.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Lista de Chequeo Legal</h2>
              <div class="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <p class="text-primary-800 font-medium mb-4">
                  Para ayudarte a preparar tu consulta legal, hemos creado una lista de chequeo con
                  los documentos y información más importantes:
                </p>
                <a
                  href="/Lista_Chequeo_Legal_Lexic.pdf"
                  download
                  class="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  Descargar Lista de Chequeo
                </a>
              </div>
            </section>

            <div class="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">¿Listo para comenzar?</h3>
              <p class="text-gray-700 mb-4">
                Únete a miles de usuarios que ya confían en Lexic para sus necesidades legales.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <NuxtLink
                  to="/questions/ask"
                  class="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Hacer una consulta
                </NuxtLink>
                <NuxtLink
                  to="/lawyers"
                  class="inline-flex items-center justify-center border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Buscar abogados
                </NuxtLink>
              </div>
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
  title: 'Acerca de Lexic - Nuestra Misión y Valores',
  meta: [
    {
      name: 'description',
      content:
        'Conoce más sobre Lexic, nuestra misión de democratizar el acceso a la asesoría legal y nuestros valores fundamentales.'
    }
  ]
})
</script>
