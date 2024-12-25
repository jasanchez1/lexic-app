interface Education {
  school: string
  degree: string
  year?: number
}

export interface PracticeArea {
  id: string
  name: string
  slug: string
  experienceScore: number
}

export interface Lawyer {
  id: string
  name: string
  title: string
  reviewScore: number
  reviewCount: number
  professionalStartDate: Date
  areas: PracticeArea[]
  bio: string
  imageURL: string
  phone: string
  city: string
  email: string
  catchPhrase?: string
  languages?: string[]
  education?: Education[]
}
