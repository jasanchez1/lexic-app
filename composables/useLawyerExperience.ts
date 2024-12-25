import { ref } from 'vue'
import type { Education, WorkExperience, Achievement, LawyerStats } from '~/types/experience'

export const useLawyerExperience = () => {
  const education = ref<Education[]>([])
  const workExperience = ref<WorkExperience[]>([])
  const achievements = ref<Achievement[]>([])
  const stats = ref<LawyerStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchExperience = async (lawyerId: string) => {
    isLoading.value = true
    error.value = null

    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      // Mock data
      education.value = [
        {
          institution: 'Universidad de Chile',
          degree: 'Licenciado en Ciencias Jurídicas y Sociales',
          year: 2021,
          honors: 'Distinción Máxima'
        },
        {
          institution: 'Universidad Católica',
          degree: 'Magíster en Derecho de los Negocios',
          year: 2022
        }
      ]

      workExperience.value = [
        {
          role: 'Socio Principal',
          company: 'Libbey Law Offices',
          startDate: '2023-01',
          description: 'Especializado en derecho civil y comercial'
        },
        {
          role: 'Asociado Senior',
          company: 'Carey y Cía',
          startDate: '2021-03',
          endDate: '2022-12',
          description: 'Práctica en litigios comerciales y arbitrajes'
        }
      ]

      achievements.value = [
        {
          title: 'Premio Colegio de Abogados - Mejor Tesis',
          year: 2021,
          issuer: 'Colegio de Abogados de Chile'
        },
        {
          title: 'Reconocimiento Excelencia Académica',
          year: 2020,
          issuer: 'Universidad de Chile'
        }
      ]

      stats.value = {
        casesWon: 45,
        totalCases: 52,
        yearsExperience: 2,
        specializedAreas: 3
      }
    } catch (e) {
      console.error(e)
      error.value = 'Error al cargar la experiencia'
    } finally {
      isLoading.value = false
    }
  }

  return {
    education,
    workExperience,
    achievements,
    stats,
    isLoading,
    error,
    fetchExperience
  }
}
