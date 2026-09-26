import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Category } from '@/types'

// Estado de módulo: la lista de categorías se comparte entre el filtro de
// productos, el formulario y la pantalla de categorías.
const categories = ref<Category[]>([])
const loading = ref(false)
let loaded = false

export function useAdminCategories() {
  const toast = useToastStore()

  async function load(force = false) {
    if (loaded && !force) return
    loading.value = true
    try {
      categories.value = await adminService.listCategories()
      loaded = true
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  const sorted = computed(() =>
    [...categories.value].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
  )

  function upsert(category: Category) {
    const index = categories.value.findIndex((c) => c._id === category._id)
    if (index === -1) categories.value.push(category)
    else categories.value[index] = { ...categories.value[index], ...category }
  }

  function remove(id: string) {
    categories.value = categories.value.filter((c) => c._id !== id)
  }

  return { categories: sorted, loading, load, upsert, remove }
}
