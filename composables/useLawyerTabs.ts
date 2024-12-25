import { ref } from 'vue'

export type LawyerTab = 'overview' | 'reviews' | 'experience'

// Keep state outside the composable to persist it
const activeTab = ref<LawyerTab>('overview')

export const useLawyerTabs = () => {
  const tabs = [
    { id: 'overview' as const, name: 'Resumen' },
    { id: 'reviews' as const, name: 'Reseñas' },
    { id: 'experience' as const, name: 'Experiencia' }
  ]

  const setActiveTab = (tab: LawyerTab) => {
    activeTab.value = tab
  }

  return {
    tabs,
    activeTab,
    setActiveTab
  }
}
