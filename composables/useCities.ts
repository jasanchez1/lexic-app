import { ref } from 'vue'
import { useCitiesService } from '~/services/api'
import type { City } from '~/types/city'

export const useCities = () => {
  const citiesService = useCitiesService()
  const cities = ref<City[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCities = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await citiesService.list()
      cities.value = response
      
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