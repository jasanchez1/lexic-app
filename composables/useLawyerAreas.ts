import { computed } from 'vue'

export interface LegalArea {
  id: string
  name: string
  slug: string
  category: LegalCategory
  description?: string
}

export type LegalCategory =
  | 'civil'
  | 'family'
  | 'labor'
  | 'criminal'
  | 'commercial'
  | 'consumer'
  | 'tax'
  | 'humanRights'
  | 'other'

export const useLawyerAreas = () => {
  const areas: LegalArea[] = [
    // Family Law
    {
      id: 'pension-alimenticia',
      name: 'Pensión Alimenticia',
      slug: 'pension-alimenticia',
      category: 'family',
      description: 'Casos relacionados con pensiones de alimentos'
    },
    {
      id: 'divorcio',
      name: 'Divorcio',
      slug: 'divorcio',
      category: 'family',
      description: 'Procesos de divorcio y separación'
    },
    {
      id: 'tuicion',
      name: 'Tuición',
      slug: 'tuicion',
      category: 'family'
    },
    // Labor Law
    {
      id: 'despido-injustificado',
      name: 'Despido Injustificado',
      slug: 'despido-injustificado',
      category: 'labor'
    },
    {
      id: 'derechos-laborales',
      name: 'Defensa de Derechos Laborales',
      slug: 'derechos-laborales',
      category: 'labor'
    },
    {
      id: 'accidentes-laborales',
      name: 'Accidentes Laborales',
      slug: 'accidentes-laborales',
      category: 'labor'
    },
    // Criminal Law
    {
      id: 'robos-hurtos',
      name: 'Robos y Hurtos',
      slug: 'robos-hurtos',
      category: 'criminal'
    },
    {
      id: 'violencia-intrafamiliar',
      name: 'Violencia Intrafamiliar',
      slug: 'violencia-intrafamiliar',
      category: 'criminal'
    },
    {
      id: 'manejo-ebriedad',
      name: 'Manejo en estado de ebriedad',
      slug: 'manejo-ebriedad',
      category: 'criminal'
    }
  ]

  const categories = {
    civil: 'Civil',
    family: 'Familia',
    labor: 'Laboral',
    criminal: 'Penal',
    commercial: 'Comercial',
    consumer: 'Consumidor',
    tax: 'Tributario',
    humanRights: 'Derechos Humanos',
    other: 'Otros'
  } as const

  const groupedAreas = computed(() => {
    return areas.reduce(
      (acc, area) => {
        if (!acc[area.category]) {
          acc[area.category] = []
        }
        acc[area.category].push(area)
        return acc
      },
      {} as Record<LegalCategory, LegalArea[]>
    )
  })

  return {
    areas,
    groupedAreas,
    categories
  }
}
