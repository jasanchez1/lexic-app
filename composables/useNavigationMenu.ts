import { ref } from 'vue'
import { useFetch } from '~/utils/api'

interface FeaturedArea {
  id: string
  name: string
  slug: string
}

interface Area {
  id: string
  name: string
  slug: string
  featured_areas: FeaturedArea[]
}

interface FeaturedSubtopic {
  id: string
  name: string
  slug: string
}

interface Topic {
  id: string
  name: string
  slug: string
  featured_subtopics: FeaturedSubtopic[]
}

interface FeaturedGuide {
  id: string
  title: string
  slug: string
  description: string
}

interface GuideCategory {
  id: string
  name: string
  slug: string
  featured_guides: FeaturedGuide[]
}

interface NavigationMenu {
  areas: Area[]
  topics: Topic[]
  guides: GuideCategory[]
}

export const useNavigationMenu = () => {
  const api = useFetch()
  const navigationMenu = ref<NavigationMenu | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchNavigationMenu = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get('/navigation/menu')
      navigationMenu.value = response as NavigationMenu
      return navigationMenu.value
    } catch (err) {
      console.error('Error fetching navigation menu:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar el menú de navegación'
      navigationMenu.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    navigationMenu,
    isLoading,
    error,
    fetchNavigationMenu
  }
}