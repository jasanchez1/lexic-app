export interface Education {
  institution: string
  degree: string
  year: number
  honors?: string
}

export interface WorkExperience {
  role: string
  company: string
  startDate: string
  endDate?: string // optional for current positions
  description?: string
}

export interface Achievement {
  title: string
  year: number
  issuer: string
  description?: string
}

export interface LawyerStats {
  casesWon: number
  totalCases: number
  yearsExperience: number
  specializedAreas: number
}
