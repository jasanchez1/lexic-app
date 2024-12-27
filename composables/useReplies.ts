import { ref } from 'vue'
import type { Reply } from '~/types/question'

const mockReplies: Record<string, Reply[]> = {
  a1: [
    {
      id: 'r1',
      content:
        'Sí, es posible modificar el monto de la pensión de alimentos cuando hay un cambio significativo en las circunstancias económicas. El proceso implica...',
      answerId: 'a1',
      author: {
        id: 'l1',
        name: 'Gabriel Boric',
        title: 'Abogado de Familia',
        imageUrl:
          'https://www.cidob.org/sites/default/files/styles/max_width_290/public/gabriel_boric_font.jpg.webp',
        isLawyer: true
      },
      date: '2024-01-24'
    },
    {
      id: 'r2',
      content:
        'Complementando la respuesta anterior, es importante mencionar que los tribunales consideran tanto sus ingresos como los gastos del menor...',
      answerId: 'a1',
      author: {
        id: 'l2',
        name: 'Carolina Pérez',
        title: 'Abogada Civil',
        isLawyer: true
      },
      date: '2024-01-25'
    }
  ]
}

export const useReplies = () => {
  const replies = ref<Reply[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchReplies = async (answerId: string) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      replies.value = Object.values(mockReplies).flat()
    } catch (e) {
      console.error(e)
      error.value = 'Error al cargar las respuestas'
    } finally {
      isLoading.value = false
    }
  }

  return {
    replies,
    isLoading,
    error,
    fetchReplies
  }
}
