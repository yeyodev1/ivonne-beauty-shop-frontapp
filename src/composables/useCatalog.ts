import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Category, Product, ProductQuery } from '@/types'

type Sort = NonNullable<ProductQuery['sort']>

export const SORT_OPTIONS: Array<{ value: Sort; label: string }> = [
  { value: 'new', label: 'Lo más nuevo' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre (A–Z)' },
]

const PAGE_SIZE = 24

// Categorías y marcas cambian poco: se piden una vez y se comparten entre
// el header, el home y la tienda.
const categories = ref<Category[]>([])
const brands = ref<string[]>([])
const categoriesLoaded = ref(false)
const brandsLoaded = ref(false)
let categoriesPending: Promise<void> | null = null
let brandsPending: Promise<void> | null = null

function loadCategories() {
  if (categoriesLoaded.value || categoriesPending) return categoriesPending
  categoriesPending = catalogService
    .getCategories()
    .then((data) => {
      categories.value = data.filter((c) => c.isActive !== false)
    })
    .catch(() => {})
    .finally(() => {
      // Aun si falla se da por cargado: mejor ocultar la sección que un skeleton eterno.
      categoriesLoaded.value = true
      categoriesPending = null
    })
  return categoriesPending
}

function loadBrands() {
  if (brandsLoaded.value || brandsPending) return brandsPending
  brandsPending = catalogService
    .getBrands()
    .then((data) => {
      brands.value = data.filter(Boolean)
    })
    .catch(() => {})
    .finally(() => {
      brandsLoaded.value = true
      brandsPending = null
    })
  return brandsPending
}

export function useCatalogTaxonomy() {
  void loadCategories()
  void loadBrands()
  return { categories, brands, categoriesLoaded, brandsLoaded }
}

function one(value: LocationQuery[string] | undefined): string {
  const text = Array.isArray(value) ? value[0] : value
  return (text || '').toString().trim()
}

/** La URL (en español) es la fuente de verdad; esto la traduce al API. */
export function queryFromRoute(q: LocationQuery): ProductQuery {
  const sort = one(q.orden) as Sort
  const page = Number(one(q.pagina)) || 1
  return {
    category: one(q.categoria) || undefined,
    brand: one(q.marca) || undefined,
    q: one(q.q) || undefined,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : undefined,
    page: page > 1 ? page : undefined,
    limit: PAGE_SIZE,
  }
}

type Filters = { categoria?: string; marca?: string; q?: string; orden?: string; pagina?: number }

export function useCatalog() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const products = ref<Product[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(true)

  const query = computed(() => queryFromRoute(route.query))
  const page = computed(() => query.value.page || 1)
  const activeCategory = computed(() =>
    categories.value.find((c) => c.slug === query.value.category),
  )
  const hasFilters = computed(() =>
    Boolean(query.value.category || query.value.brand || query.value.q),
  )

  let requestId = 0
  async function fetchProducts() {
    const id = ++requestId
    loading.value = true
    try {
      const data = await catalogService.getProducts(query.value)
      if (id !== requestId) return
      products.value = data.items
      total.value = data.total
      pages.value = Math.max(1, data.pages)
    } catch (e) {
      if (id !== requestId) return
      products.value = []
      total.value = 0
      toast.error((e as ApiError).message)
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  /** Cambia filtros en la URL; cualquier filtro nuevo vuelve a la página 1. */
  function setFilters(patch: Filters) {
    const next: Record<string, string> = {}
    const merged: Filters = {
      categoria: query.value.category,
      marca: query.value.brand,
      q: query.value.q,
      orden: query.value.sort,
      pagina: 'pagina' in patch ? patch.pagina : undefined,
      ...patch,
    }
    Object.entries(merged).forEach(([key, value]) => {
      if (value === undefined || value === '' || (key === 'pagina' && Number(value) <= 1)) return
      next[key] = String(value)
    })
    router.push({ path: '/tienda', query: next })
  }

  function clearFilters() {
    router.push({ path: '/tienda', query: query.value.sort ? { orden: query.value.sort } : {} })
  }

  watch(
    () => route.fullPath,
    () => {
      if (route.path === '/tienda') void fetchProducts()
    },
    { immediate: true },
  )

  void loadCategories()
  void loadBrands()

  return {
    products,
    total,
    pages,
    page,
    loading,
    query,
    categories,
    brands,
    activeCategory,
    hasFilters,
    setFilters,
    clearFilters,
  }
}

/**
 * Estado activo del menú. RouterLink ignora query y hash al marcar activo,
 * así que "Tienda", "Novedades" (/tienda?orden=new) y "Visítanos" (/#visitanos)
 * se encendían juntos. Gana el enlace que coincide exacto; si ninguno, el de
 * la misma ruta sin query ni hash.
 */
export function useCatalogNavActive(links: ReadonlyArray<{ to: string }>) {
  const route = useRoute()
  return (to: string): boolean => {
    const exact = links.find((l) => l.to === route.fullPath)
    if (exact) return exact.to === to
    return !/[?#]/.test(to) && to === route.path
  }
}
