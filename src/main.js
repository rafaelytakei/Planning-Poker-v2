import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Ripple from 'primevue/ripple'
// import 'primevue/resources/themes/vela-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import PrimeVue from 'primevue/config'
const plugins = import.meta.globEager('./plugins/*.js')
const middlewares = import.meta.globEager('./middleware/*.js')
const app = createApp(App)
// Apply store
app.use(store)
// Apply router
app.use(router)
// Apply plugin
for (const plugin in plugins) {
  app.use(plugins[plugin].default)
}
// Nuxt-like middleware setup
app.mixin({
  async beforeCreate() {
    if (this.$options.middleware) {
      for (const middleware of this.$options.middleware) {
        for (const mdPath in middlewares) {
          if (mdPath === `./middleware/${middleware}.js`) {
            await middlewares[mdPath].default({
              ...app.config.globalProperties,
              env: import.meta.env,
            })
          }
        }
      }
    }
  },
})
// PrimeVue
// app.use(PrimeVue)
// app.component('Card', Card)
app.directive('ripple', Ripple)
app.use(PrimeVue)
// Mounting the app
app.mount('#app')
