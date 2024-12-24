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
