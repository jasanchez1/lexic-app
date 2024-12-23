import type { Lawyer } from '~/types/lawyer'

export const useAnalytics = () => {
  const trackProfileView = (lawyer: Lawyer, source: 'name' | 'button') => {
    console.log('Analytics - Profile View:', {
      event: 'profile_view',
      lawyer_id: lawyer.id,
      lawyer_name: lawyer.name,
      source: source,
      timestamp: new Date().toISOString()
    })
  }

  const trackCallEvent = (lawyer: Lawyer, completed: boolean = false) => {
    console.log('Analytics - Call:', {
      event: 'call_lawyer',
      lawyer_id: lawyer.id,
      lawyer_name: lawyer.name,
      completed: completed,
      timestamp: new Date().toISOString()
    })
  }

  const trackMessageEvent = (lawyer: Lawyer, status: 'opened' | 'sent') => {
    console.log('Analytics - Message:', {
      event: 'message_lawyer',
      lawyer_id: lawyer.id,
      lawyer_name: lawyer.name,
      status: status,
      timestamp: new Date().toISOString()
    })
  }

  return {
    trackProfileView,
    trackCallEvent,
    trackMessageEvent
  }
}
