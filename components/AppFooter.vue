<template>
  <footer class="bg-gray-900 text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center mb-4">
            <img src="/lexic-logo.png" alt="Lexic" class="h-8 w-auto filter brightness-0 invert" />
          </div>
          <p class="text-gray-300 mb-6 max-w-md">
            Democratizando el acceso a la asesoría legal de calidad a través de nuestra plataforma digital segura y transparente.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/lawyers" class="text-gray-300 hover:text-white transition-colors duration-200">
                Buscar Abogados
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/questions/ask" class="text-gray-300 hover:text-white transition-colors duration-200">
                Hacer una Pregunta
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/guides" class="text-gray-300 hover:text-white transition-colors duration-200">
                Guías Legales
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq" class="text-gray-300 hover:text-white transition-colors duration-200">
                Preguntas Frecuentes
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-gray-300 hover:text-white transition-colors duration-200">
                Acerca de Nosotros
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Legal</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/legal/terms" class="text-gray-300 hover:text-white transition-colors duration-200">
                Términos y Condiciones
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/legal/privacy" class="text-gray-300 hover:text-white transition-colors duration-200">
                Política de Privacidad
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/legal/abuse-policy" class="text-gray-300 hover:text-white transition-colors duration-200">
                Políticas Anti-abuso
              </NuxtLink>
            </li>
            <li>
              <a href="/docs/Consentimiento_Tratamiento_Datos.docx" download class="text-gray-300 hover:text-white transition-colors duration-200">
                Consentimiento de Datos
              </a>
            </li>
            <li>
              <a href="/docs/Lista_Chequeo_Legal_Lexic.docx" download class="text-gray-300 hover:text-white transition-colors duration-200">
                Lista de Chequeo Legal
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">
            © {{ currentYear }} Lexic. Todos los derechos reservados.
          </p>
          <div class="flex space-x-6 text-sm">
            <NuxtLink to="/legal/terms" class="text-gray-400 hover:text-white transition-colors duration-200">
              Términos
            </NuxtLink>
            <NuxtLink to="/legal/privacy" class="text-gray-400 hover:text-white transition-colors duration-200">
              Privacidad
            </NuxtLink>
            <NuxtLink to="/faq" class="text-gray-400 hover:text-white transition-colors duration-200">
              FAQ
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>