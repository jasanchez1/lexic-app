<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <!-- Blue Bar Secondary Navigation -->
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
          <span class="text-white text-sm">Posesión Efectiva en Chile</span>
        </div>
      </div>
    </div>

    <!-- Guide content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        Guía Completa para la Posesión Efectiva en Chile
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
            to="/guides/alzamiento-hipotecas-chile"
            class="bg-white border p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-medium">Alzamiento de Hipotecas en Chile</h3>
            <p class="text-gray-600 text-sm">
              Guía legal sobre el proceso de alzamiento de hipotecas.
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
    title: '¿Qué es la Posesión Efectiva?',
    isOpen: true, // Always open
    content: `
        <p>La Posesión Efectiva es el trámite legal que reconoce oficialmente la calidad de heredero y el derecho a disponer de los bienes dejados por una persona fallecida. Es un procedimiento obligatorio en Chile para que los herederos puedan:</p>
        <ul>
          <li>Transferir bienes inmuebles (casas, terrenos, etc.)</li>
          <li>Cobrar dineros superiores a cierto monto</li>
          <li>Realizar trámites bancarios</li>
          <li>Acceder a beneficios estatales</li>
        </ul>
        <p>Este trámite puede realizarse de forma testamentaria (cuando existe un testamento) o intestada (cuando no existe testamento).</p>
      `
  },
  {
    id: 'testamentaria',
    title: 'Posesión Efectiva Testamentaria',
    isOpen: false,
    content: `
        <p>La posesión efectiva testamentaria se aplica cuando la persona fallecida dejó un testamento válido. En este caso:</p>
        <ul>
          <li>Debe tramitarse ante un notario público (no ante el Registro Civil)</li>
          <li>Requiere la presentación del testamento original o copia autorizada</li>
          <li>Los herederos serán aquellos designados en el testamento</li>
          <li>El proceso es generalmente más rápido y directo que la posesión intestada</li>
        </ul>
        <p>Es importante tener en cuenta que en Chile existe una porción de la herencia que debe respetarse para ciertos herederos forzosos (como hijos o cónyuge), incluso si el testamento indica otra cosa.</p>
      `
  },
  {
    id: 'intestada',
    title: 'Posesión Efectiva Intestada',
    isOpen: false,
    content: `
        <p>Cuando una persona fallece sin dejar testamento, la ley determina quiénes son sus herederos y cómo se distribuirán los bienes. En Chile, este trámite:</p>
        <ul>
          <li>Se realiza en el Registro Civil e Identificación</li>
          <li>Puede hacerse en línea (<a href="https://www.registrocivil.cl" target="_blank" class="text-primary-600 hover:underline">www.registrocivil.cl</a>) o presencialmente</li>
          <li>Es gratuito para la mayoría de los casos (cuando el patrimonio no supera las 15 UTM)</li>
          <li>Sigue un orden de sucesión establecido por ley: primero hijos y cónyuge, luego padres, luego hermanos, etc.</li>
        </ul>
        <p>El proceso puede tomar entre 30 y 90 días dependiendo de la complejidad del caso y si se presentan objeciones.</p>
      `
  },
  {
    id: 'plazos-costos',
    title: 'Plazos y Costos Asociados',
    isOpen: false,
    content: `
        <h3 class="text-lg font-medium mb-2">Plazos</h3>
        <ul>
          <li>Posesión efectiva intestada: Entre 30 y 90 días desde su solicitud</li>
          <li>Posesión efectiva testamentaria: Variable según la complejidad, aproximadamente 30-60 días</li>
        </ul>
        
        <h3 class="text-lg font-medium mt-4 mb-2">Costos</h3>
        <ul>
          <li>Posesión efectiva intestada en Registro Civil: Gratuita para herencias hasta 15 UTM</li>
          <li>Posesión efectiva testamentaria en notarías: Entre 1 y 3 UTM dependiendo de la notaría y la complejidad</li>
          <li>Impuesto a la herencia: Aplica para patrimonios superiores a 50 UTA, con tasas progresivas según monto y parentesco</li>
          <li>Inscripción de la resolución en el Conservador de Bienes Raíces: 0,2% del valor del inmueble aproximadamente</li>
        </ul>
        
        <p class="mt-3">Adicionalmente, pueden existir gastos de abogado si se requiere asesoría legal, que pueden variar entre 5 y 20 UF dependiendo de la complejidad del caso.</p>
      `
  },
  {
    id: 'errores-comunes',
    title: 'Errores Comunes y Consejos',
    isOpen: false,
    content: `
        <h3 class="text-lg font-medium mb-2">Errores frecuentes</h3>
        <ul>
          <li>No declarar todos los bienes del causante, lo que puede invalidar el proceso</li>
          <li>Omitir herederos, generando conflictos legales posteriores</li>
          <li>Valorizar incorrectamente los bienes</li>
          <li>No considerar deudas pendientes del fallecido</li>
          <li>Desconocer los plazos y procedimientos legales</li>
        </ul>
        
        <h3 class="text-lg font-medium mt-4 mb-2">Consejos prácticos</h3>
        <ul>
          <li>Reúna toda la documentación necesaria antes de iniciar el trámite</li>
          <li>Identifique a todos los posibles herederos según la ley</li>
          <li>Inventarie adecuadamente todos los bienes y deudas</li>
          <li>Considere la asistencia de un abogado para casos complejos</li>
          <li>Verifique si existen beneficios estatales o pensiones por cobrar</li>
        </ul>
        
        <p class="mt-3">Recuerde que la posesión efectiva no tiene plazo para solicitarse, pero mientras no se realice, los herederos no podrán disponer legalmente de los bienes heredados.</p>
      `
  },
  {
    id: 'normas-relacionadas',
    title: 'Normas Relacionadas',
    isOpen: false,
    content: `
        <p>El proceso de posesión efectiva está regulado principalmente por:</p>
        <ul>
          <li>Código Civil, Libro III "De la sucesión por causa de muerte"</li>
          <li>Ley N° 19.903 sobre Procedimiento para el Otorgamiento de la Posesión Efectiva</li>
          <li>Decreto Ley N° 824 sobre Impuesto a la Renta (para aspectos tributarios)</li>
          <li>Ley N° 16.271 sobre Impuesto a las Herencias, Asignaciones y Donaciones</li>
        </ul>
        
        <p class="mt-3">Para trámites especiales o casos particulares, pueden aplicar otras normas como el DFL-1 del Ministerio de Justicia o la Ley N° 20.830 para acuerdos de unión civil.</p>
      `
  },
  {
    id: 'ayuda-legal',
    title: '¿Necesitas Ayuda Legal?',
    isOpen: false,
    content: `
        <p>Obtener asistencia profesional puede ser crucial en casos de herencias complejas. Recomendamos buscar ayuda legal cuando:</p>
        <ul>
          <li>Existen bienes de alto valor</li>
          <li>Hay disputas entre herederos</li>
          <li>El fallecido tenía deudas significativas</li>
          <li>Existen bienes en el extranjero</li>
          <li>Hay menores de edad entre los herederos</li>
        </ul>
        
        <p class="mt-3">Puede consultar con un abogado especialista en derecho sucesorio o acudir a las Corporaciones de Asistencia Judicial si necesita asesoría gratuita.</p>
        
        <div class="mt-6 p-4 bg-primary-50 rounded-lg">
          <h4 class="font-semibold mb-2">¿Necesitas asesoría personalizada?</h4>
          <p>Nuestros abogados especialistas en derecho sucesorio pueden ayudarte con tu caso particular.</p>
          <NuxtLink 
            to="/lawyers?area=sucesiones" 
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
