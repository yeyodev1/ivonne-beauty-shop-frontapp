import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminService, type ProductStatusFilter } from '@/services/admin.service'
import { useAdminList } from './useAdminList'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product } from '@/types'

export const PRODUCT_STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'published', label: 'Publicados' },
  { value: 'draft', label: 'Borradores' },
  { value: 'out', label: 'Agotados' },
]

export function useAdminProducts() {
  const route = useRoute()
  const toast = useToastStore()

  const initialStatus = String(route.query.status || '')
  const list = useAdminList<Product, { status: string; category: string }>(
    (query) =>
      adminService.listProducts({
        ...query,
        status: query.status as ProductStatusFilter | '',
        limit: 20,
      }),
    { status: initialStatus, category: '' },
  )

  const busyId = ref('')

  async function toggle(product: Product, field: 'isPublished' | 'isFeatured') {
    busyId.value = product._id
    const next = !product[field]
    try {
      const updated = await adminService.updateProduct(product._id, { [field]: next })
      Object.assign(product, updated)
      if (field === 'isPublished') toast.success(next ? 'Producto publicado' : 'Producto oculto de la tienda')
      else toast.success(next ? 'Producto destacado' : 'Ya no está destacado')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      busyId.value = ''
    }
  }

  return { ...list, busyId, toggle }
}
