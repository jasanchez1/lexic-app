import { ref } from 'vue'
import type { Lawyer } from '~/types/lawyer'

export const useLawyerSearch = () => {
  const lawyers = ref<Lawyer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const searchLawyers = async (params: {
    area?: string
    city?: string
    query?: string
    sort?: string
  }) => {
    isLoading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      lawyers.value = [
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
          phone: '+34673287793',
          city: 'Santiago'
        }
      ]
    } catch (e) {
      console.error(e)
      error.value = 'Error al buscar abogados'
      lawyers.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    lawyers,
    isLoading,
    error,
    searchLawyers
  }
}
