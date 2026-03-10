export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useAuth()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})

/*

any page that requires auth
definePageMeta({
  middleware: 'auth'
})

*/
