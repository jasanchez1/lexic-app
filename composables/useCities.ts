import { ref } from 'vue'
import { useFetch } from '~/utils/api'
import type { City } from '~/types/city'

export const useCities = () => {
  const api = useFetch()
  const cities = ref<City[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCities = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Note: Assuming there will be a cities endpoint in the future
      // For now, we'll use a hardcoded list
      // When the API endpoint becomes available, uncomment the next line
      // const response = await api.get('/cities/')
      
      // Mock API response
      cities.value = [
        { id: 'santiago', name: 'Santiago', slug: 'santiago' },
        { id: 'valparaiso', name: 'Valparaíso', slug: 'valparaiso' },
        { id: 'concepcion', name: 'Concepción', slug: 'concepcion' },
        { id: 'antofagasta', name: 'Antofagasta', slug: 'antofagasta' },
        { id: 'la-serena', name: 'La Serena', slug: 'la-serena' }
      ]
      
      return cities.value
    } catch (e) {
      console.error('Error fetching cities:', e)
      error.value = e instanceof Error ? e.message : 'Error al cargar ciudades'
      cities.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    cities,
    isLoading,
    error,
    fetchCities
  }
}