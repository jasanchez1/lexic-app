import { ref } from 'vue'
import type { Lawyer } from '~/types/lawyer'

const currentLawyer = ref<Lawyer | null>(null)

export const useNavigation = () => {
  const setCurrentLawyer = (lawyer: Lawyer | null) => {
    currentLawyer.value = lawyer
  }

  return {
    currentLawyer,
    setCurrentLawyer
  }
}
