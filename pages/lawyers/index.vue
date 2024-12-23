<template>
  <div class="min-h-screen bg-white">
    <!-- City Filter -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <h2 class="text-lg font-medium mb-4">Filtrar por Ciudad</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="city in cities"
          :key="city"
          class="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100"
        >
          {{ city }}
        </button>
      </div>
    </div>

    <!-- Lawyer Cards -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">52 Abogados Civil con 8 Reseñas</h2>
        <select class="border rounded-md px-3 py-2">
          <option>Mejor coincidencia</option>
          <option>Calificación más alta</option>
          <option>Más experiencia</option>
        </select>
      </div>

      <!-- Lawyer Card -->
      <div
        v-for="lawyer in lawyers"
        :key="lawyer.id"
        class="border rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between">
          <!-- Left side with lawyer info -->
          <div class="flex">
            <div class="w-32 h-32 flex-shrink-0">
              <img
                :src="lawyer.imageURL"
                :alt="lawyer.name"
                class="rounded-lg w-full h-full object-cover"
              />
            </div>
            <div class="ml-6">
              <NuxtLink :to="`/lawyers/${lawyer.id}`" @click="trackProfileView(lawyer, 'name')">
                <h3
                  class="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {{ lawyer.name }}
                </h3>
              </NuxtLink>
              <div class="flex items-center mt-2">
                <span class="text-lg font-bold">{{ lawyer.reviewScore }}</span>
                <div class="flex text-secondary-400 ml-2">
                  {{ '★'.repeat(5) }}
                </div>
                <span class="ml-2 text-sm text-gray-600">{{ lawyer.reviewCount }} reseñas</span>
              </div>
              <div class="text-sm text-gray-600">{{ lawyer.title }}</div>
              <div class="mt-4">
                <div class="text-sm">
                  <span class="font-medium"
                    >Experiencia:
                    {{ calculateYearsOfExperience(lawyer.professionalStartDate) }}</span
                  >
                </div>
                <div class="text-sm mt-1">
                  <span class="font-medium">Áreas:</span> {{ lawyer.areas.join(', ') }}
                </div>
                <p class="mt-2 text-sm text-gray-600 line-clamp-2">
                  {{ lawyer.bio }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right side with actions -->
          <div class="flex flex-col gap-4 self-center">
            <!-- Call button -->
            <div>
              <!-- Call button -->
              <button
                class="w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
                @click="
                  showCallModal = true;
                  trackCallEvent(lawyer, false)
                "
              >
                <span class="flex items-center justify-center gap-2">
                  <Phone class="w-4 h-4" />
                  Llamar ahora
                </span>
              </button>

              <!-- Call Modal -->
              <div
                v-if="showCallModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                  <h3 class="text-lg font-bold mb-4">Llamar a {{ lawyer.name }}</h3>
                  <p class="text-gray-600 mb-4">{{ lawyer.phone }}</p>
                  <div class="flex gap-3">
                    <button
                      class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                      @click="handleCall(lawyer.phone)"
                    >
                      Llamar
                    </button>
                    <button
                      class="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      @click="showCallModal = false"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Modal -->
            <div
              v-if="showMessageModal"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-bold">Enviar mensaje a {{ selectedLawyer?.name }}</h3>
                    <p class="text-sm text-gray-600">{{ selectedLawyer?.title }}</p>
                  </div>
                  <button
                    class="text-gray-400 hover:text-gray-600"
                    @click="showMessageModal = false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div class="space-y-4">
                  <!-- Name Field -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      id="name"
                      v-model="messageForm.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <!-- Email Field -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      id="email"
                      v-model="messageForm.email"
                      type="email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <!-- Phone Field -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono (opcional)
                    </label>
                    <input
                      id="phone"
                      v-model="messageForm.phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <!-- Message Field -->
                  <div>
                    <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      v-model="messageForm.message"
                      rows="4"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                  </div>
                </div>

                <!-- Message Modal -->
                <div
                  v-if="showMessageModal"
                  class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <h3 class="text-lg font-bold">
                          Enviar mensaje a {{ selectedLawyer?.name }}
                        </h3>
                        <p class="text-sm text-gray-600">{{ selectedLawyer?.title }}</p>
                      </div>
                      <button
                        class="text-gray-400 hover:text-gray-600"
                        @click="showMessageModal = false"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div class="space-y-4">
                      <!-- Name Field -->
                      <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          id="name"
                          v-model="messageForm.name"
                          type="text"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Tu nombre completo"
                        />
                      </div>

                      <!-- Email Field -->
                      <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          id="email"
                          v-model="messageForm.email"
                          type="email"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="tu@email.com"
                        />
                      </div>

                      <!-- Phone Field -->
                      <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono (opcional)
                        </label>
                        <input
                          id="phone"
                          v-model="messageForm.phone"
                          type="tel"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>

                      <!-- Message Field -->
                      <div>
                        <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                          Mensaje *
                        </label>
                        <textarea
                          id="message"
                          v-model="messageForm.message"
                          rows="4"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Escribe tu mensaje aquí..."
                        ></textarea>
                      </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                      <button
                        class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!messageForm.name || !messageForm.email || !messageForm.message"
                        @click="handleSendMessage"
                      >
                        Enviar mensaje
                      </button>
                      <button
                        class="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                        @click="showMessageModal = false"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 mt-6">
                  <button
                    class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!messageForm.name || !messageForm.email || !messageForm.message"
                    @click="handleSendMessage"
                  >
                    Enviar mensaje
                  </button>
                  <button
                    class="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                    @click="showMessageModal = false"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="grid grid-cols-2 gap-2">
              <NuxtLink
                :to="`/lawyers/${lawyer.id}`"
                class="flex items-center justify-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                @click="trackProfileView(lawyer, 'button')"
              >
                Ver Perfil
              </NuxtLink>
              <button
                class="flex items-center justify-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                @click.prevent="handleOpenMessage(lawyer)"
              >
                Mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Phone } from 'lucide-vue-next' // If using lucide icons

interface Lawyer {
  id: string
  name: string
  title: string
  reviewScore: number
  reviewCount: number
  professionalStartDate: Date
  areas: string[]
  bio: string
  imageURL: string
  phone: string
}

const showMessageModal = ref(false)
const selectedLawyer = ref<Lawyer | null>(null)
const showCallModal = ref(false)
const messageForm = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const handleOpenMessage = (lawyer: Lawyer) => {
  selectedLawyer.value = lawyer
  showMessageModal.value = true
  trackMessageEvent(lawyer, 'opened')
}

const handleSendMessage = () => {
  if (!selectedLawyer.value) return

  console.log('Sending message:', messageForm.value)
  trackMessageEvent(selectedLawyer.value, 'sent')

  // Reset form and close modal
  messageForm.value = {
    name: '',
    email: '',
    phone: '',
    message: ''
  }
  showMessageModal.value = false
  selectedLawyer.value = null
}

const trackProfileView = (lawyer: Lawyer, source: 'name' | 'button') => {
  console.log('Analytics - Profile View:', {
    event: 'profile_view',
    lawyer_id: lawyer.id,
    lawyer_name: lawyer.name,
    source: source,
    timestamp: new Date().toISOString()
  })
}

const trackCallEvent = (lawyer: Lawyer, completed: boolean = false) => {
  console.log('Analytics - Call:', {
    event: 'call_lawyer',
    lawyer_id: lawyer.id,
    lawyer_name: lawyer.name,
    completed: completed,
    timestamp: new Date().toISOString()
  })
}

const trackMessageEvent = (lawyer: Lawyer, status: 'opened' | 'sent') => {
  console.log('Analytics - Message:', {
    event: 'message_lawyer',
    lawyer_id: lawyer.id,
    lawyer_name: lawyer.name,
    status: status,
    timestamp: new Date().toISOString()
  })
}

const handleCall = (phone: string) => {
  if (!selectedLawyer.value) return

  // eslint-disable-next-line no-undef
  window.location.href = `tel:${phone}`
  trackCallEvent(selectedLawyer.value, true)
  showCallModal.value = false
}

function calculateYearsOfExperience(startDate: Date): string {
  const ageDifMs = Date.now() - startDate
  const ageDate = new Date(ageDifMs)
  const yearsOfXP = Math.abs(ageDate.getUTCFullYear() - 1970)
  return `${yearsOfXP} ${yearsOfXP === 1 ? 'año' : 'años'}`
}

const cities = ['Santiago']

const lawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Garbielito Boric',
    title: 'Abogado Civil Chile',
    reviewScore: 5.0,
    reviewCount: 1,
    professionalStartDate: new Date('2022-09-28T14:30:00Z'),
    areas: ['Civil', 'Derecho Personal', 'Accidentes'],
    bio: 'Gabrielito, socio principal de Libbey Law Offices, enfoca su práctica en las áreas de derecho civil.',
    imageURL:
      'https://www.cidob.org/sites/default/files/styles/max_width_290/public/gabriel_boric_font.jpg.webp',
    phone: '+34673287793'
  }
]
</script>
