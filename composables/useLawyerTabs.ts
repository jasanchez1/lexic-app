import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type LawyerTab = 'overview' | 'reviews' | 'experience'

export const useLawyerTabs = () => {
  const route = useRoute()
  const router = useRouter()
  const activeTab = ref<LawyerTab>((route.query.tab as LawyerTab) || 'overview')
  const tabs = [
    { id: 'overview' as const, name: 'Resumen' },
    { id: 'reviews' as const, name: 'Reseñas' },
    { id: 'experience' as const, name: 'Experiencia' }
  ]

  const setActiveTab = async (tab: LawyerTab) => {
    await router.replace({
      query: { ...route.query, tab }
    })
    activeTab.value = tab
  }

  watch(
    () => route.query.tab,
    newTab => {
      if (newTab && tabs.some(t => t.id === newTab)) {
        activeTab.value = newTab as LawyerTab
      }
    }
  )

  return {
    tabs,
    activeTab,
    setActiveTab
  }
}
