export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated } = useAuth()
    
    // If user is not authenticated and trying to access a protected route
    if (!isAuthenticated.value && to.meta.requiresAuth) {
      // Redirect to home page or login page
      return navigateTo('/')
    }
  })