import type { Lawyer } from '~/types/lawyer'
import { useAnalyticsService } from '~/services/api'

export const useAnalytics = () => {
  const analyticsService = useAnalyticsService()

  const trackProfileView = (lawyer: Lawyer, source: 'name' | 'button') => {
    // Fire and forget API call (don't wait or return anything)
    setTimeout(() => {
      try {
        // Use the service layer to make the API call
        analyticsService.trackProfileView(lawyer.id, source)
          .catch(err => console.error('Failed to track profile view:', err))
      } catch (error) {
        console.error('Error tracking profile view:', error)
      }
    }, 0)
  }

  const trackCallEvent = (lawyer: Lawyer, completed: boolean = false) => {
    console.log('Analytics - Call:', {
      event: 'call_lawyer',
      lawyer_id: lawyer.id,
      lawyer_name: lawyer.name,
      completed: completed,
      timestamp: new Date().toISOString()
    })
    
    // Fire and forget API call
    setTimeout(() => {
      try {
        analyticsService.trackCall(lawyer.id, {
          completed,
          timestamp: new Date().toISOString()
        }).catch(err => console.error('Failed to track call event:', err))
      } catch (error) {
        console.error('Error tracking call event:', error)
      }
    }, 0)
  }

  const trackMessageEvent = (lawyer: Lawyer, status: 'opened' | 'sent') => {
    // Fire and forget API call
    setTimeout(() => {
      try {
        analyticsService.trackMessageEvent(lawyer.id, status)
          .catch(err => console.error('Failed to track message event:', err))
      } catch (error) {
        console.error('Error tracking message event:', error)
      }
    }, 0)
  }

  const trackQuestionView = (questionId: string) => {
    // Fire and forget API call
    setTimeout(() => {
      try {
        analyticsService.trackQuestionView(questionId)
          .catch(err => console.error('Failed to track question view:', err))
      } catch (error) {
        console.error('Error tracking question view:', error)
      }
    }, 0)
  }

  const trackGuideView = (guideId: string) => {
    // Fire and forget API call
    setTimeout(() => {
      try {
        analyticsService.trackGuideView(guideId)
          .catch(err => console.error('Failed to track guide view:', err))
      } catch (error) {
        console.error('Error tracking guide view:', error)
      }
    }, 0)
  }

  const trackListingClick = (lawyerId: string, searchContext: {
    search_query?: string,
    area_slug?: string,
    city_slug?: string,
    position?: number
  }) => {
    // Fire and forget API call
    setTimeout(() => {
      try {
        analyticsService.trackListingClick(lawyerId, {
          ...searchContext,
          timestamp: new Date().toISOString()
        }).catch(err => console.error('Failed to track listing click:', err))
      } catch (error) {
        console.error('Error tracking listing click:', error)
      }
    }, 0)
  }

  return {
    trackProfileView,
    trackCallEvent,
    trackMessageEvent,
    trackQuestionView,
    trackGuideView,
    trackListingClick
  }
}