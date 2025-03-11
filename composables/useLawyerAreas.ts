import { ref, computed, onMounted } from 'vue'
import { useAreasService, useCategoriesService } from '~/services/api'

export interface PracticeArea {
  id: string
  name: string
  slug: string
  category_id: string // Keep this as snake_case to match the API response
  description?: string
  lawyerCount?: number // Add lawyer count property
}

export interface PracticeAreaCategory {
  id: string
  name: string
  slug: string
}

export interface GroupedAreas {
  [key: string]: PracticeArea[]
}

export const useLawyerAreas = () => {
  const areasService = useAreasService()
  const areas = ref<PracticeArea[]>([])
  const categories = ref<Record<string, PracticeAreaCategory>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Mapping of category IDs to friendly names
  // This will be updated once we fetch categories
  const categoryLabels = ref<Record<string, string>>({})
  
  const groupedAreas = computed(() => {
    const result: GroupedAreas = {}
    
    areas.value.forEach(area => {
      // Handle both snake_case and camelCase property names
      const categoryId = area.category_id || (area as any).categoryId
      
      if (!categoryId) {
        console.warn('Area missing category ID:', area)
        return
      }
      
      if (!result[categoryId]) {
        result[categoryId] = []
      }
      
      result[categoryId].push(area)
    })
    
    return result
  })
  
  // Fetch all practice areas
  const fetchAreas = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // First fetch categories
      await fetchCategories()
      
      // Then fetch areas
      const data = await areasService.list()
      areas.value = data
      
      return data
    } catch (err) {
      console.error('Error fetching practice areas:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar áreas de práctica'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch all practice areas with lawyer counts
  const fetchAreasWithCounts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // First fetch categories
      await fetchCategories()
      
      // Then fetch areas with counts
      const data = await areasService.getWithCounts()
      areas.value = data
      
      return data
    } catch (err) {
      console.error('Error fetching practice areas with counts:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar áreas de práctica'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch all practice area categories
  const fetchCategories = async () => {
    try {
      // Fetch areas grouped by category
      const data = await areasService.getGroupedByCategory()
      
      // Process the categories
      categories.value = {}
      
      data.forEach((item: any) => {
        // Handle both snake_case and camelCase property names
        const id = item.id
        const name = item.name
        const slug = item.slug
        
        if (id && name) {
          categories.value[id] = {
            id,
            name,
            slug
          }
          
          // Also update category labels
          categoryLabels.value[id] = name
        }
      })
      
      return data
    } catch (err) {
      console.error('Error fetching practice area categories:', err)
      return []
    }
  }
  
  // Fetch areas for a specific category
  const fetchAreasByCategory = async (categoryId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await areasService.getByCategory(categoryId)
      return data
    } catch (err) {
      console.error(`Error fetching areas for category ${categoryId}:`, err)
      error.value = err instanceof Error ? err.message : 'Error al cargar áreas de categoría'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch areas for a specific category by slug
  const fetchAreasByCategorySlug = async (slug: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await areasService.getByCategorySlug(slug)
      return data
    } catch (err) {
      console.error(`Error fetching areas for category slug ${slug}:`, err)
      error.value = err instanceof Error ? err.message : 'Error al cargar áreas de categoría'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Initialize data on mount
  onMounted(() => {
    fetchAreas()
  })
  
  return {
    areas,
    categories: categoryLabels,
    categoriesData: categories,
    groupedAreas,
    isLoading,
    error,
    fetchAreas,
    fetchAreasWithCounts, // New method to fetch areas with counts
    fetchAreasByCategory,
    fetchAreasByCategorySlug
  }
}