<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center h-14">
          <NuxtLink
            to="/guides"
            class="text-primary-100 hover:text-white text-sm transition-colors duration-200"
          >
            Guías Legales
          </NuxtLink>
          <span class="mx-2 text-primary-300">›</span>
          <span class="text-white text-sm">Alzamiento de Hipotecas en Chile</span>
        </div>
      </div>
    </div>

    <!-- Guide content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        Guía Legal sobre el Alzamiento de Hipotecas en Chile
      </h1>

      <!-- Compact Table of contents -->
      <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div class="flex flex-wrap gap-x-6 gap-y-2">
          <button
            v-for="(section, index) in sections"
            :key="index"
            class="text-primary-600 hover:text-primary-800 hover:underline text-left text-sm font-medium"
            @click="scrollToSection(section.id)"
          >
            {{ section.title }}
          </button>
        </div>
      </div>

      <!-- Guide sections -->
      <div class="space-y-6">
        <div
          v-for="(section, index) in sections"
          :key="index"
          :id="section.id"
          class="bg-white rounded-lg shadow-sm border overflow-hidden"
        >
          <!-- Section header (always visible) -->
          <button
            class="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
            @click="toggleSection(index)"
          >
            <h2 class="text-xl font-bold text-gray-900">{{ section.title }}</h2>
            <ChevronDown
              v-if="section.id !== 'que-es'"
              class="w-5 h-5 transition-transform duration-200"
              :class="{ 'rotate-180': section.isOpen }"
            />
          </button>

          <!-- Section content (collapsible) -->
          <div v-show="section.isOpen || section.id === 'que-es'" class="px-6 py-4 border-t">
            <div
              class="prose prose-slate prose-ul:list-disc prose-ul:pl-5 max-w-none"
              v-html="section.content"
            ></div>
          </div>
        </div>
      </div>

      <!-- Related guides -->
      <div class="mt-12">
        <h2 class="text-xl font-bold mb-4">Guías relacionadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink
            to="/guides/posesion-efectiva-chile"
            class="bg-white border p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-medium">Posesión Efectiva en Chile</h3>
            <p class="text-gray-600 text-sm">
              Todo lo que necesitas saber sobre el trámite de posesión efectiva.
            </p>
          </NuxtLink>
          <NuxtLink
            to="/guides/cambio-nombre-apellido-chile"
            class="bg-white border p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-medium">Cambio de Nombre y Apellido en Chile</h3>
            <p class="text-gray-600 text-sm">
              Guía completa para el proceso de cambio de nombre y apellido.
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'

// Define the guide sections with collapsible content - first section always visible
const sections = ref([
  {
    id: 'que-es',
    title: '¿Qué es una Hipoteca?',
    isOpen: true, // Always open
    content: `
        <p>Una hipoteca es un derecho real que se constituye sobre un bien inmueble para garantizar el cumplimiento de una obligación, generalmente el pago de un préstamo. En términos simples, es un acuerdo entre un deudor y un acreedor en el que el deudor ofrece su propiedad como garantía del préstamo. Si el deudor no cumple con los pagos, el acreedor tiene el derecho de ejecutar la hipoteca y vender el inmueble para recuperar el dinero prestado.</p>
        <p>En Chile, las hipotecas están reguladas principalmente por el Código Civil, específicamente en los artículos 2407 y siguientes. Estos artículos establecen las características, requisitos y efectos de las hipotecas.</p>
      `
  },
  {
    id: 'alzamiento',
    title: '¿Qué es el Alzamiento de Hipotecas?',
    isOpen: false,
    content: `
        <p>El alzamiento de hipotecas es el proceso mediante el cual se cancela la inscripción de una hipoteca en el Registro de Hipotecas y Gravámenes del Conservador de Bienes Raíces, una vez que la deuda garantizada ha sido pagada en su totalidad. Este trámite es esencial para que el propietario del inmueble pueda disponer libremente de su propiedad, sin restricciones.</p>
        <p>La Ley N° 20.855, promulgada en 2015, introdujo disposiciones específicas sobre el alzamiento de hipotecas, estableciendo que las entidades financieras y los bancos son responsables de realizar los trámites de alzamiento una vez que el deudor ha pagado completamente su deuda. Esta ley busca simplificar el proceso para los deudores y evitarles trámites adicionales.</p>
      `
  },
  {
    id: 'procedimiento',
    title: 'Procedimiento de Alzamiento',
    isOpen: false,
    content: `
        <h3 class="text-lg font-medium mb-2">Pasos para el Alzamiento de Hipotecas</h3>
        <ol class="list-decimal pl-5 mb-4">
          <li class="mb-2"><strong>Pago Total de la Deuda:</strong><br>
          El deudor debe haber pagado completamente la deuda garantizada por la hipoteca.</li>
          <li class="mb-2"><strong>Solicitud de Alzamiento:</strong><br>
          El deudor puede solicitar a la entidad financiera que inicie el trámite de alzamiento. Sin embargo, según la Ley N° 20.855, es responsabilidad de la entidad financiera realizar este trámite sin necesidad de solicitud expresa del deudor.</li>
          <li class="mb-2"><strong>Escritura Pública de Alzamiento:</strong><br>
          La entidad financiera debe otorgar una escritura pública de alzamiento ante notario, en la cual se declare que la deuda ha sido pagada y que la hipoteca queda cancelada.</li>
          <li class="mb-2"><strong>Inscripción en el Conservador de Bienes Raíces:</strong><br>
          La escritura pública de alzamiento debe ser inscrita en el Registro de Hipotecas y Gravámenes del Conservador de Bienes Raíces correspondiente. Este paso es crucial para que el alzamiento tenga efectos frente a terceros.</li>
          <li class="mb-2"><strong>Notificación al Deudor:</strong><br>
          Una vez inscrito el alzamiento, la entidad financiera debe notificar al deudor que la hipoteca ha sido cancelada.</li>
        </ol>
        
        <h3 class="text-lg font-medium mt-4 mb-2">Ejemplo Práctico</h3>
        <p>Juan ha terminado de pagar su crédito hipotecario. El banco debe ahora realizar el alzamiento de la hipoteca. El banco otorga una escritura pública de alzamiento y la inscribe en el Conservador de Bienes Raíces. Una vez inscrito, el banco notifica a Juan que su hipoteca ha sido cancelada y que su propiedad está libre de cargas.</p>
      `
  },
  {
    id: 'plazos-costos',
    title: 'Plazos y Costos Asociados',
    isOpen: false,
    content: `
        <h3 class="text-lg font-medium mb-2">Plazos</h3>
        <p>El tiempo puede variar, pero generalmente el proceso de alzamiento puede tardar entre 30 y 60 días desde el pago total de la deuda.</p>
        
        <h3 class="text-lg font-medium mt-4 mb-2">Costos</h3>
        <p>Los costos pueden incluir:</p>
        <ul>
          <li>Honorarios notariales para la escritura pública de alzamiento</li>
          <li>Tasas de inscripción en el Conservador de Bienes Raíces</li>
        </ul>
        <p>Sin embargo, algunos bancos pueden cubrir estos costos como parte de sus servicios. Es importante consultar directamente con su entidad financiera sobre los costos específicos asociados al alzamiento de su hipoteca.</p>
      `
  },
  {
    id: 'preguntas-frecuentes',
    title: 'Preguntas Frecuentes (FAQ)',
    isOpen: false,
    content: `
        <div class="space-y-4">
          <div>
            <h3 class="font-medium">¿Qué pasa si la entidad financiera no realiza el alzamiento?</h3>
            <p>Si la entidad financiera no realiza el alzamiento, el deudor puede presentar una queja ante la Superintendencia de Bancos e Instituciones Financieras (SBIF) o iniciar acciones legales para exigir el cumplimiento de la Ley N° 20.855.</p>
          </div>
          
          <div>
            <h3 class="font-medium">¿Cuánto tiempo tarda el proceso de alzamiento?</h3>
            <p>El tiempo puede variar, pero generalmente el proceso de alzamiento puede tardar entre 30 y 60 días desde el pago total de la deuda.</p>
          </div>
          
          <div>
            <h3 class="font-medium">¿Hay algún costo asociado al alzamiento de hipotecas?</h3>
            <p>Los costos pueden incluir honorarios notariales y tasas de inscripción en el Conservador de Bienes Raíces. Sin embargo, algunos bancos pueden cubrir estos costos como parte de sus servicios.</p>
          </div>
          
          <div>
            <h3 class="font-medium">¿Necesito un abogado para realizar el alzamiento de hipoteca?</h3>
            <p>No es estrictamente necesario, ya que según la Ley N° 20.855, es responsabilidad de la entidad financiera realizar este trámite. Sin embargo, en casos complejos o si surgen problemas, puede ser útil contar con asesoría legal.</p>
          </div>
        </div>
      `
  },
  {
    id: 'consejos',
    title: 'Consejos Prácticos',
    isOpen: false,
    content: `
        <ul>
          <li class="mb-2"><strong>Verificar el Alzamiento:</strong> Asegúrate de que la entidad financiera haya realizado el alzamiento y que esté inscrito en el Conservador de Bienes Raíces.</li>
          <li class="mb-2"><strong>Guardar Documentos:</strong> Conserva todos los documentos relacionados con el pago de la deuda y el alzamiento, ya que pueden ser necesarios en el futuro.</li>
          <li class="mb-2"><strong>Solicitar Certificado:</strong> Una vez completado el alzamiento, puedes solicitar un certificado de hipotecas y gravámenes en el Conservador de Bienes Raíces para verificar que tu propiedad está libre de cargas.</li>
          <li class="mb-2"><strong>Dar Seguimiento:</strong> No asumas que el proceso se realizará automáticamente; dale seguimiento y solicita actualizaciones a tu entidad financiera.</li>
        </ul>
      `
  },
  {
    id: 'normas-relacionadas',
    title: 'Normas Relacionadas',
    isOpen: false,
    content: `
        <ul>
          <li>Código Civil: Artículos 2407 y siguientes.</li>
          <li>Ley N° 20.855: Regula el alzamiento de hipotecas y establece las obligaciones de las entidades financieras.</li>
        </ul>
      `
  },
  {
    id: 'ayuda-legal',
    title: '¿Necesitas Ayuda Legal?',
    isOpen: false,
    content: `
        <p>Realizar el trámite de alzamiento de hipotecas puede ser complejo y abrumador. Contar con el apoyo de un abogado experto puede facilitar el proceso y asegurar que todo se realice correctamente.</p>
        
        <div class="mt-6 p-4 bg-primary-50 rounded-lg">
          <h4 class="font-semibold mb-2">¿Necesitas asesoría personalizada?</h4>
          <p>Nuestros abogados especialistas en derecho inmobiliario pueden ayudarte con tu caso particular.</p>
          <NuxtLink 
            to="/lawyers?area=inmobiliario" 
            class="mt-3 inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Consultar con un Abogado
          </NuxtLink>
        </div>
      `
  }
])

// Function to toggle a section's open state (except for the first section which is always open)
const toggleSection = (index: number) => {
  if (sections.value[index].id !== 'que-es') {
    sections.value[index].isOpen = !sections.value[index].isOpen
  }
}

// Function to scroll to a specific section
// Definition of page meta data
definePageMeta({
  title: 'Alzamiento de Hipotecas en Chile - Guía Legal Completa',
  description:
    'Guía legal sobre el proceso de alzamiento de hipotecas en Chile, requisitos, procedimiento y obligaciones de las entidades financieras.'
})

const scrollToSection = (sectionId: string) => {
  // eslint-disable-next-line no-undef
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    // Find and open the section if it's not the intro section
    const sectionIndex = sections.value.findIndex(section => section.id === sectionId)
    if (sectionIndex !== -1 && sections.value[sectionIndex].id !== 'que-es') {
      sections.value[sectionIndex].isOpen = true
    }
  }
}
</script>

<style>
/* Add some additional styling for the prose content */
.prose h3 {
  color: #1f2937;
}

.prose ul {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  list-style-type: disc;
  padding-left: 1.5rem;
}

.prose li {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.prose p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
