import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { updateUser, user } from './composables/firebase'

const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to, from) => {
  // If user is null, tries to update the user
  if (!user.value) {
    await updateUser()
  }
  // If user is still null, he's not logged in. If so, he can only access the index
  if (!user.value && to.path !== '/') {
    return {
      path: `/`,
      query: {
        from: to.fullPath,
      },
    }
  } else if (user.value && to.path === '/' && from.path === '/') {
    // If the user is already logged in, and not coming from another page from the app
    return {
      path: '/menu',
    }
  }
  return true
})
export default router
