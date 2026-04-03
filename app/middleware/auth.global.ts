export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return;
  
  const token = useCookie('auth_token')
  const nuxtApp = useNuxtApp()
  
  // Exclude login page from checking
  if (to.path === '/login') {
    if (token.value) {
      return navigateTo('/')
    }
    return
  }
  
  // Protect all other pages
  if (!token.value) {
    return navigateTo('/login')
  }
})
