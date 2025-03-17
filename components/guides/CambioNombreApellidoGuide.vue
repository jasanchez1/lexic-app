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
          <span class="text-white text-sm">Cambio de Nombre y Apellido en Chile</span>
        </div>
      </div>
    </div>

    <!-- Guide content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        Guía Completa para el Cambio de Nombre y Apellido en Chile
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
              v-if="section.id !== 'por-que'"
              class="w-5 h-5 transition-transform duration-200"
              :class="{ 'rotate-180': section.isOpen }"
            />
          </button>

          <!-- Section content (collapsible) -->
          <div v-show="section.isOpen || section.id === 'por-que'" class="px-6 py-4 border-t">
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
            to="/guides/alzamiento-hipotecas-chile"
            class="bg-white border p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-medium">Alzamiento de Hipotecas en Chile</h3>
            <p class="text-gray-600 text-sm">
              Guía legal sobre el proceso de alzamiento de hipotecas.
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

// Definition of page meta data
definePageMeta({
  title: 'Cambio de Nombre y Apellido en Chile - Guía Legal Completa',
  description:
    'Guía completa sobre el procedimiento de cambio de nombre y apellido en Chile: requisitos, proceso, plazos y costos asociados.'
})

// Define the guide sections with collapsible content - first section always visible
const sections = ref([
  {
    id: 'por-que',
    title: '¿Por qué cambiar tu nombre o apellido?',
    isOpen: true, // Always open
    content: `
        <p>Existen diversas razones por las cuales una persona puede querer cambiar su nombre o apellido en Chile:</p>
        <ul>
          <li>Evitar confusiones o errores en documentos oficiales</li>
          <li>Corregir errores de inscripción en el Registro Civil</li>
          <li>Usar de hecho un nombre o apellido distinto al inscrito por un tiempo prolongado</li>
          <li>Tener un nombre o apellido que cause menoscabo a la persona</li>
          <li>Unificar apellidos cuando existen versiones diferentes en distintos documentos</li>
          <li>Incorporar apellidos de familiares para preservar un linaje</li>
          <li>Preferencia personal y adecuación a la identidad de la persona</li>
        </ul>
        <p>Cualquiera sea el motivo, es importante conocer que este proceso está regulado por la ley en Chile y requiere seguir un procedimiento específico.</p>
      `
  },
  {
    id: 'requisitos',
    title: 'Requisitos y Documentación',
    isOpen: false,
    content: `
        <h3 class="text-lg font-medium mb-2">Documentos necesarios:</h3>
        <ul>
          <li><strong>Certificado de nacimiento:</strong> Debes obtener una copia actualizada de tu certificado de nacimiento (no mayor a 30 días).</li>
          <li><strong>Cédula de identidad:</strong> Debes presentar una fotocopia por ambos lados de tu cédula de identidad vigente.</li>
          <li><strong>Certificado de antecedentes:</strong> Para fines especiales, con una antigüedad no superior a 30 días.</li>
          <li><strong>Documentos de respaldo:</strong> Dependiendo de tu situación, podrías necesitar documentos que respalden tu solicitud, como certificados de matrimonio, divorcio, etc.</li>
          <li><strong>Documentos que acrediten el uso del nombre:</strong> Estos pueden incluir cuentas de servicios, contratos, diplomas, etc. que demuestren que usas el nombre o apellido solicitado.</li>
        </ul>
        
        <h3 class="text-lg font-medium mt-4 mb-2">Requisitos adicionales:</h3>
        <ul>
          <li>Para menores de edad, la solicitud debe ser presentada por sus padres o representantes legales.</li>
          <li>Si el cambio afecta también a hijos menores, se debe presentar certificado de nacimiento de estos.</li>
          <li>En caso de que el cambio de apellido afecte a descendientes mayores de edad, estos deberán dar su consentimiento por escrito.</li>
        </ul>
      `
  },
  {
    id: 'procedimiento',
    title: 'Procedimiento Paso a Paso',
    isOpen: false,
    content: `
        <ol class="list-decimal pl-5 mb-4">
          <li class="mb-3"><strong>Redactar una solicitud formal:</strong><br>
          La solicitud debe incluir tus datos personales completos (nombre completo, RUT, domicilio), el nombre o apellido que deseas cambiar, el nuevo nombre o apellido propuesto, y las razones detalladas que justifican el cambio. Esta solicitud debe ser clara y específica.</li>
          
          <li class="mb-3"><strong>Presentar la solicitud en el Registro Civil:</strong><br>
          Debes acudir a una oficina del Registro Civil e Identificación de tu domicilio para presentar tu solicitud junto con todos los documentos requeridos. El funcionario verificará que tu solicitud cumpla con todos los requisitos formales.</li>
          
          <li class="mb-3"><strong>Pago de tarifa:</strong><br>
          Deberás pagar la tarifa correspondiente por el trámite. El monto puede variar, por lo que es recomendable consultar el valor actualizado en el sitio web del Registro Civil.</li>
          
          <li class="mb-3"><strong>Revisión y remisión al juzgado:</strong><br>
          El Registro Civil revisará tu solicitud y la remitirá al Juzgado Civil competente de tu domicilio, donde se iniciará un proceso judicial.</li>
          
          <li class="mb-3"><strong>Resolución del juez:</strong><br>
          El juez revisará tu solicitud y los documentos presentados. En algunos casos, el juez puede solicitar una audiencia para escuchar tus razones en persona o solicitar información adicional.</li>
          
          <li class="mb-3"><strong>Publicación en el Diario Oficial:</strong><br>
          Si el juez aprueba tu solicitud, se emitirá una resolución que deberás publicar en el Diario Oficial. Esta publicación es un requisito legal para que el cambio sea oficial y sirve para que terceros puedan enterarse del cambio.</li>
          
          <li class="mb-3"><strong>Actualización de documentos:</strong><br>
          Una vez publicado el cambio, debes acudir nuevamente al Registro Civil para actualizar tu certificado de nacimiento y luego solicitar una nueva cédula de identidad. Posteriormente, deberás actualizar todos tus documentos personales (pasaporte, licencia de conducir, tarjetas bancarias, etc.).</li>
        </ol>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-blue-800 font-medium">Nota importante:</p>
          <p class="text-blue-700">El proceso completo puede tardar entre 6 meses y 1 año, dependiendo de la carga de trabajo del tribunal y la complejidad del caso. Es recomendable tener paciencia y seguir el estado del trámite regularmente.</p>
        </div>
      `
  },
  {
    id: 'causales-cambio',
    title: 'Causales Legales para el Cambio',
    isOpen: false,
    content: `
        <p>La Ley N° 17.344 establece las siguientes causales para autorizar el cambio de nombre o apellido:</p>
        
        <ol class="list-decimal pl-5 mb-4">
          <li class="mb-2">Cuando el nombre o apellido sea ridículo, risible o los menoscabe moral o materialmente.</li>
          <li class="mb-2">Cuando el solicitante haya sido conocido durante más de cinco años con nombres o apellidos, o ambos, diferentes de los propios.</li>
          <li class="mb-2">En los casos de filiación no matrimonial, para agregar el apellido del padre o madre que lo hubiere reconocido.</li>
          <li class="mb-2">Cuando los padres soliciten cambiar el orden de los apellidos de sus hijos menores de edad.</li>
          <li class="mb-2">Cuando exista otro motivo plausible que el juez calificará.</li>
        </ol>
        
        <p>La última causal es bastante amplia y otorga al juez un margen de discrecionalidad para evaluar otras situaciones no contempladas explícitamente en la ley.</p>
      `
  },
  {
    id: 'plazos-costos',
    title: 'Plazos y Costos Asociados',
    isOpen: false,
    content: `
        <h3 class="text-lg font-medium mb-2">Plazos estimados:</h3>
        <ul>
          <li>Presentación de la solicitud y remisión al juzgado: 1-2 meses</li>
          <li>Revisión y resolución del juez: 3-6 meses (aproximadamente)</li>
          <li>Publicación en el Diario Oficial y actualización de documentos: 1-2 meses</li>
          <li><strong>Tiempo total estimado:</strong> 6-12 meses</li>
        </ul>
        
        <h3 class="text-lg font-medium mt-4 mb-2">Costos aproximados:</h3>
        <ul>
          <li>Certificados del Registro Civil: $1.000 - $3.000 cada uno</li>
          <li>Tasa judicial por presentación de la solicitud: $5.000 - $15.000</li>
          <li>Publicación en el Diario Oficial: $20.000 - $40.000</li>
          <li>Nueva cédula de identidad: $4.000 - $5.000</li>
          <li>Honorarios de abogado (si se contrata uno): $300.000 - $800.000</li>
        </ul>
        
        <p class="mt-3 text-gray-700 italic">Nota: Estos valores son aproximados y pueden variar. Se recomienda consultar los costos actualizados directamente en las instituciones correspondientes.</p>
      `
  },
  {
    id: 'preguntas-frecuentes',
    title: 'Preguntas Frecuentes (FAQ)',
    isOpen: false,
    content: `
        <div class="space-y-4">
          <div>
            <h3 class="font-medium">¿Es necesario contratar un abogado para cambiar mi nombre o apellido?</h3>
            <p>No es obligatorio, pero es altamente recomendable contar con asesoría legal, especialmente si el caso es complejo. Un abogado puede ayudarte a redactar correctamente la solicitud, reunir la documentación adecuada y representarte ante el tribunal, aumentando las probabilidades de éxito de tu solicitud.</p>
          </div>
          
          <div>
            <h3 class="font-medium">¿Puedo cambiar mi nombre más de una vez?</h3>
            <p>La ley no establece un límite explícito, pero los tribunales suelen ser más estrictos con las solicitudes reiteradas de cambio de nombre. Cada solicitud será evaluada según sus propios méritos y circunstancias.</p>
          </div>
          
          <div>
            <h3 class="font-medium">¿Qué sucede con mis documentos antiguos después del cambio?</h3>
            <p>Los documentos emitidos con tu nombre anterior seguirán siendo válidos para acreditar tu identidad, pero deberás actualizarlos progresivamente. Para documentos importantes como títulos profesionales, podrías necesitar solicitar reexpediciones.</p>
          </div>
          
          <div>
            <h3 class="font-medium">¿El cambio de nombre afecta mis deudas o responsabilidades legales?</h3>
            <p>No. El cambio de nombre no extingue ni modifica tus obligaciones legales o financieras. Todas tus deudas, contratos y responsabilidades legales previas siguen vigentes bajo tu nueva identidad.</p>
          </div>
        </div>
      `
  },
  {
    id: 'normas-relacionadas',
    title: 'Normas Relacionadas',
    isOpen: false,
    content: `
        <ul>
          <li><strong>Código Civil:</strong> Artículos 17 y 18 del Código Civil chileno regulan el cambio de nombre y apellido.</li>
          <li><strong>Ley N° 17.344:</strong> Esta ley específica los procedimientos y requisitos para el cambio de nombre y apellido en Chile.</li>
          <li><strong>Decreto con Fuerza de Ley N° 1 del Ministerio de Justicia (30 de mayo de 2000):</strong> Este decreto, en su artículo 4, fija el texto refundido de la Ley N° 17.344, autorizando el cambio de nombres y apellidos.</li>
        </ul>
      `
  },
  {
    id: 'consideraciones',
    title: 'Consideraciones Finales',
    isOpen: false,
    content: `
        <ul>
          <li>El proceso puede variar ligeramente dependiendo de la región y de la complejidad del caso.</li>
          <li>Algunos juzgados pueden tener requisitos adicionales o interpretaciones diferentes de la ley.</li>
          <li>Es importante tener en cuenta que el cambio de nombre o apellido tiene consecuencias legales y administrativas importantes, como la actualización de todos tus documentos oficiales.</li>
          <li>El cambio de nombre no elimina antecedentes penales, deudas o responsabilidades legales.</li>
          <li>Si tienes hijos, considera cómo el cambio de apellido podría afectarlos, tanto legal como emocionalmente.</li>
        </ul>
      `
  },
  {
    id: 'ayuda-legal',
    title: '¿Necesitas Ayuda Legal?',
    isOpen: false,
    content: `
        <p>Realizar el trámite de cambio de nombre y apellido puede ser complejo y abrumador. Contar con el apoyo de un abogado experto puede facilitar el proceso y asegurar que todo se realice correctamente.</p>
        
        <div class="mt-6 p-4 bg-primary-50 rounded-lg">
          <h4 class="font-semibold mb-2">¿Necesitas asesoría personalizada?</h4>
          <p>Nuestros abogados especialistas en derecho civil pueden ayudarte con tu caso particular.</p>
          <NuxtLink 
            to="/lawyers?area=civil" 
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
  if (sections.value[index].id !== 'por-que') {
    sections.value[index].isOpen = !sections.value[index].isOpen
  }
}

// Function to scroll to a specific section
const scrollToSection = (sectionId: string) => {
  // eslint-disable-next-line no-undef
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    // Find and open the section if it's not the intro section
    const sectionIndex = sections.value.findIndex(section => section.id === sectionId)
    if (sectionIndex !== -1 && sections.value[sectionIndex].id !== 'por-que') {
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
