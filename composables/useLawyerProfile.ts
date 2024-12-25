import { ref } from 'vue'
import type { Lawyer } from '~/types/lawyer'

export const useLawyerProfile = () => {
  const profile = ref<Lawyer | null>(null)
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
        id: '1',
        name: 'Garbielito Boric',
        title: 'Abogado Civil Chile',
        reviewScore: 5.0,
        reviewCount: 1,
        professionalStartDate: new Date('2022-09-28T14:30:00Z'),
        areas: [
          { name: 'Civil', id: 'civil', experienceScore: 60, slug: 'civil' },
          {
            name: 'Derecho Personal',
            id: 'derecho-personal',
            experienceScore: 40,
            slug: 'derecho-personal'
          },
          { name: 'Accidentes', id: 'accidentes', experienceScore: 30, slug: 'accidentes' }
        ],
        bio: 'Gabrielito, socio principal de Libbey Law Offices, enfoca su práctica en las áreas de derecho civil.',
        imageURL:
          'https://www.cidob.org/sites/default/files/styles/max_width_290/public/gabriel_boric_font.jpg.webp',
        phone: '+34673287793',
        city: 'Santiago',
        email: 'gboric@example.com'
      }
    } catch (e) {
      console.error(e)
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
