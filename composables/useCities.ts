import { ref } from 'vue'
import type { City } from '~/types/city'

export const useCities = () => {
  const cities = ref<City[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCities = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      // Mock API response
      cities.value = [{ id: '1', name: 'Santiago', slug: 'santiago' }]
    } catch (e) {
      console.error(e)
      error.value = 'Error al cargar el perfil'
      cities.value = []
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
