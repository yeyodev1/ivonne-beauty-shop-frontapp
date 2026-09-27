import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import '@/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const userStore = useUserStore(pinia)

// httpBase emite este evento al recibir un 401: la sesión caducó.
window.addEventListener('auth:token-expired', () => {
  userStore.clear()
  if (router.currentRoute.value.meta.requiresAuth) {
    router.replace({ name: 'Login', query: { next: router.currentRoute.value.fullPath } })
  }
})

// Se monta cuando la vista inicial (que llega en su propio chunk) ya está
// resuelta: si no, se vería el header con el footer pegado debajo y la página
// aparecería de golpe un instante después. index.html hace el fundido.
router.isReady().finally(() => {
  app.mount('#app')
  window.dispatchEvent(new Event('app:mounted'))
})
