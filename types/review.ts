export interface LawyerReview {
  id: string
  rating: number
  title?: string
  content: string
  author: string
  date: string
  isHiredAttorney: boolean
}

export interface ReviewStats {
  average: number
  total: number
  distribution: {
    [key: number]: number // 1-5 stars: percentage
  }
}
