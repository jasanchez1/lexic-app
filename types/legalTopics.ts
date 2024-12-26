export interface LegalTopic {
  id: string
  name: string
  description: string
  questionsCount: number
  slug: string
  subtopics?: LegalTopic[]
}
