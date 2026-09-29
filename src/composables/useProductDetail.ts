import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import type { ApiError, Category, Product, ProductShade } from '@/types'

export function useProductDetail() {
  const route = useRoute()
  const toast = useToastStore()

  const product = ref<Product | null>(null)
  const related = ref<Product[]>([])
  const loading = ref(true)
  const notFound = ref(false)
  // Lo comparten la caja de compra y la barra fija de móvil
  const shadeId = ref('')

  const shade = computed<ProductShade | null>(
    () => product.value?.shades?.find((s) => s._id === shadeId.value) || null,
  )

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
      // ?tono= viene del carrito: al volver a la ficha el tono sigue elegido
      const wanted = String(route.query.tono || '')
      const match = data.product.shades?.find((s) => s._id === wanted && s.isActive && s.stock > 0)
      shadeId.value = match?._id || ''
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

  return { product, related, loading, notFound, category, discount, shadeId, shade }
}
