export interface Answer {
  id: string
  content: string
  author: {
    id: string
    name: string
    title: string
    imageUrl?: string
    rating: number
    reviewCount: number
    isVerified?: boolean
  }
  date: string
  isAccepted?: boolean
  upvotes: number
}

export interface Question {
  id: string
  title: string
  content: string
  author: {
    name: string
    location: string
  }
  date: string
  topicIds: string[]
  answerCount: number
  viewCount: number
  answers?: Answer[]
}
