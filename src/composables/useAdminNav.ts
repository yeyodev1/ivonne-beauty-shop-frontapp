import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

export interface AdminNavItem {
  label: string
  icon: string
  to: { name: string }
  // Rutas hijas que también encienden el ítem (p. ej. el formulario de producto)
  match: string[]
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Panel', icon: 'fa-solid fa-chart-simple', to: { name: 'AdminDashboard' }, match: ['AdminDashboard'] },
  {
    label: 'Productos',
    icon: 'fa-solid fa-bag-shopping',
    to: { name: 'AdminProducts' },
    match: ['AdminProducts', 'AdminProductNew', 'AdminProductEdit'],
  },
  {
    label: 'Pedidos',
    icon: 'fa-solid fa-receipt',
    to: { name: 'AdminOrders' },
    match: ['AdminOrders', 'AdminOrderDetail'],
  },
  { label: 'Categorías', icon: 'fa-solid fa-layer-group', to: { name: 'AdminCategories' }, match: ['AdminCategories'] },
]

export const ADMIN_NAV_MORE: AdminNavItem[] = [
  { label: 'Clientes', icon: 'fa-solid fa-user-group', to: { name: 'AdminCustomers' }, match: ['AdminCustomers'] },
  { label: 'Usuarios', icon: 'fa-solid fa-user-shield', to: { name: 'AdminUsers' }, match: ['AdminUsers'] },
  { label: 'Ajustes', icon: 'fa-solid fa-sliders', to: { name: 'AdminSettings' }, match: ['AdminSettings'] },
]

// Pantallas "de detalle": muestran flecha atrás en la barra superior
const BACK_TARGETS: Record<string, string> = {
  AdminProductNew: 'AdminProducts',
  AdminProductEdit: 'AdminProducts',
  AdminOrderDetail: 'AdminOrders',
}

export function useAdminNav() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const toast = useToastStore()

  const title = computed(() => (route.meta.title as string) || 'Panel')
  const backTo = computed(() => {
    const target = BACK_TARGETS[String(route.name)]
    return target ? { name: target } : null
  })

  function isActive(item: AdminNavItem) {
    return item.match.includes(String(route.name))
  }

  const moreActive = computed(() => ADMIN_NAV_MORE.some(isActive))

  function logout() {
    userStore.clear()
    toast.info('Cerraste sesión')
    router.push({ name: 'Login' })
  }

  return { title, backTo, isActive, moreActive, logout, userStore }
}
