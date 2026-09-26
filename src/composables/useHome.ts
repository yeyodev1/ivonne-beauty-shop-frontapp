import { ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import type { Product } from '@/types'

export function useHome() {
  const favorites = ref<Product[]>([])
  const arrivals = ref<Product[]>([])
  const loading = ref(true)

  async function load() {
    loading.value = true
    const [featured, newest] = await Promise.allSettled([
      catalogService.getProducts({ featured: true, limit: 8 }),
      catalogService.getProducts({ sort: 'new', limit: 8 }),
    ])
    const newItems = newest.status === 'fulfilled' ? newest.value.items : []
    const featuredItems = featured.status === 'fulfilled' ? featured.value.items : []
    arrivals.value = newItems
    // Sin destacados marcados, los favoritos son lo más nuevo.
    favorites.value = featuredItems.length ? featuredItems : newItems.slice(0, 8)
    loading.value = false
  }

  void load()

  return { favorites, arrivals, loading }
}
