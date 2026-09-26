import { onUnmounted, reactive, ref, watch, type Ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Paginated } from '@/types'

/**
 * Lista paginada del admin con buscador y filtros.
 *
 * Cambiar un filtro vuelve a la página 1; escribir en el buscador espera a
 * que la dueña deje de teclear para no pedir una página por cada letra.
 */
export function useAdminList<T, F extends Record<string, string>>(
  fetcher: (query: F & { q: string; page: number }) => Promise<Paginated<T>>,
  initialFilters: F,
) {
  const toast = useToastStore()

  const items = ref([]) as Ref<T[]>
  const total = ref(0)
  const pages = ref(1)
  const page = ref(1)
  const q = ref('')
  const filters = reactive({ ...initialFilters }) as F
  const loading = ref(true)

  let requestId = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  async function load() {
    const current = ++requestId
    loading.value = true
    try {
      const result = await fetcher({ ...filters, q: q.value.trim(), page: page.value })
      // Si llegó otra búsqueda mientras tanto, esta respuesta ya no sirve.
      if (current !== requestId) return
      items.value = result.items
      total.value = result.total
      pages.value = Math.max(1, result.pages)
    } catch (e) {
      if (current === requestId) toast.error((e as ApiError).message)
    } finally {
      if (current === requestId) loading.value = false
    }
  }

  function reload(resetPage = false) {
    if (resetPage && page.value !== 1) page.value = 1
    else load()
  }

  watch(page, () => {
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
  watch(filters, () => reload(true))
  watch(q, () => {
    clearTimeout(timer)
    timer = setTimeout(() => reload(true), 350)
  })

  onUnmounted(() => clearTimeout(timer))

  load()

  return { items, total, pages, page, q, filters, loading, reload: load }
}
