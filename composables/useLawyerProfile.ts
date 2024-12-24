import { ref } from 'vue'

export interface LawyerProfile {
  id: string
  name: string
  imageURL: string
  alias?: string
  rating: number
  reviewCount: number
  qualification: number
  licensedYears: number
  address: string
  bio: string
  mainArea: string // Added this for the secondary nav
  practiceAreas: {
    name: string
    percentage: number
  }[]
    phone: string
    email: string

}

export const useLawyerProfile = () => {
  const profile = ref<LawyerProfile | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchProfile = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      // Mock API response
      profile.value = {
        id,
        name: 'Gabrielito Boric',
        imageURL:
          'https://www.cidob.org/sites/default/files/styles/max_width_290/public/gabriel_boric_font.jpg.webp',
        alias: 'Alexander I. Passo',
        rating: 4.3,
        reviewCount: 6,
        qualification: 10.0,
        licensedYears: 10,
        address: '73 Ski Hill Rd., Ogden Dunes, IN, 46368',
        mainArea: 'Derecho Comercial',
        bio: 'Gabrielito Boric representa a clientes en una variedad de asuntos...',
        practiceAreas: [
          { name: 'Comercial', percentage: 40 },
          { name: 'Bancario', percentage: 30 },
          { name: 'Contratos', percentage: 20 },
          { name: 'Otros', percentage: 10 }
        ],
        phone: '+1234567890',
        email: 'gboric@example.com'
      }
    } catch (e) {
      error.value = 'Error al cargar el perfil'
      profile.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    profile,
    isLoading,
    error,
    fetchProfile
  }
}
