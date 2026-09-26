import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import type { ApiError, Category, Product } from '@/types'

export function useProductDetail() {
  const route = useRoute()
  const toast = useToastStore()

  const product = ref<Product | null>(null)
  const related = ref<Product[]>([])
  const loading = ref(true)
  const notFound = ref(false)

  const category = computed<Category | null>(() => {
    const c = product.value?.category
    return c && typeof c === 'object' ? c : null
  })

  const discount = computed(() => {
    const p = product.value
    if (!p?.compareAtPrice || p.compareAtPrice <= p.price) return 0
    return Math.round((1 - p.price / p.compareAtPrice) * 100)
  })

  async function load(slug: string) {
    loading.value = true
    notFound.value = false
    try {
      const data = await catalogService.getProduct(slug)
      product.value = data.product
      related.value = data.related || []
      document.title = `${data.product.name} — ${site.name}`
    } catch (e) {
      product.value = null
      related.value = []
      const error = e as ApiError
      if (error.status === 404) {
        notFound.value = true
        document.title = `Producto no encontrado — ${site.name}`
      } else toast.error(error.message)
    } finally {
      loading.value = false
    }
  }

  watch(
    () => route.params.slug,
    (slug) => {
      if (typeof slug === 'string' && slug) void load(slug)
    },
    { immediate: true },
  )

  return { product, related, loading, notFound, category, discount }
}
