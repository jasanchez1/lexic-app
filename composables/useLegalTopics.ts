import { ref } from 'vue'
import type { LegalTopic } from '~/types/legalTopics'

const mockTopics: LegalTopic[] = [
  {
    id: 'family',
    name: 'Divorcios y Pensión Alimenticia',
    description:
      'Procesos de separación y acuerdos de manutención para hijos, pensiones de alimentos.',
    questionsCount: 1234,
    slug: 'divorcios-pension-alimenticia',
    subtopics: [
      {
        id: 'divorce',
        name: 'Divorcio',
        description: 'Procesos de separación matrimonial',
        questionsCount: 756,
        slug: 'divorcio'
      },
      {
        id: 'alimony',
        name: 'Pensión Alimenticia',
        description: 'Acuerdos y disputas sobre pensiones alimenticias',
        questionsCount: 478,
        slug: 'pension-alimenticia'
      }
    ]
  },
  {
    id: 'labor',
    name: 'Derechos Laborales',
    description: 'Despidos injustificados, acoso laboral y reclamaciones de indemnización.',
    questionsCount: 892,
    slug: 'derechos-laborales',
    subtopics: [
      {
        id: 'wrongful-termination',
        name: 'Despido Injustificado',
        description: 'Procedimientos y derechos ante despidos',
        questionsCount: 445,
        slug: 'despido-injustificado'
      },
      {
        id: 'workplace-harassment',
        name: 'Acoso Laboral',
        description: 'Casos de acoso y ambiente laboral hostil',
        questionsCount: 447,
        slug: 'acoso-laboral'
      }
    ]
  },
  {
    id: 'property',
    name: 'Derechos de Propiedad',
    description:
      'Disputas sobre la propiedad de bienes inmuebles y problemas con contratos de arrendamiento.',
    questionsCount: 967,
    slug: 'derechos-propiedad',
    subtopics: [
      {
        id: 'real-estate',
        name: 'Bienes Raíces',
        description: 'Compraventa y disputas de propiedades',
        questionsCount: 534,
        slug: 'bienes-raices'
      },
      {
        id: 'rental',
        name: 'Arriendos',
        description: 'Problemas entre arrendadores y arrendatarios',
        questionsCount: 433,
        slug: 'arriendos'
      }
    ]
  }
]

const topics = ref<LegalTopic[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useLegalTopics = () => {
  const fetchTopics = async () => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      topics.value = mockTopics
    } catch (e) {
      console.error(e)
      error.value = 'Error al cargar los temas legales'
    } finally {
      isLoading.value = false
    }
  }

  return {
    topics,
    isLoading,
    error,
    fetchTopics
  }
}
