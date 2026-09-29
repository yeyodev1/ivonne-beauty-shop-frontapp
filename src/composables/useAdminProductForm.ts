import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService, type ProductPayload } from '@/services/admin.service'
import { useAdminCategories } from './useAdminCategories'
import { useToastStore } from '@/stores/toast'
import { centsToInput, inputToCents } from '@/utils/format'
import type { ApiError, Product, ProductImage, ProductShade } from '@/types'

function emptyForm() {
  return {
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: 1,
    isPublished: true,
    isFeatured: false,
    tags: [] as string[],
    shades: [] as ProductShade[],
  }
}

/** Crear y editar producto. Con `route.params.id` edita; sin él, crea. */
export function useAdminProductForm() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()
  const { categories, load: loadCategories } = useAdminCategories()

  const productId = ref(String(route.params.id || ''))
  const isEdit = computed(() => Boolean(productId.value))

  const form = reactive(emptyForm())
  const images = ref<ProductImage[]>([])
  const brands = ref<string[]>([])
  const loading = ref(isEdit.value)
  const saving = ref(false)
  const deleting = ref(false)
  const errors = reactive({ name: '', price: '', shades: '' })

  function fill(product: Product) {
    Object.assign(form, {
      name: product.name,
      brand: product.brand,
      category:
        typeof product.category === 'string' ? product.category : product.category?._id || '',
      description: product.description,
      price: centsToInput(product.price),
      compareAtPrice: centsToInput(product.compareAtPrice),
      stock: product.stock,
      isPublished: product.isPublished,
      isFeatured: product.isFeatured,
      tags: [...(product.tags || [])],
      // Copia: editar un tono no debe tocar el producto cargado hasta guardar
      shades: (product.shades || []).map((s) => ({ ...s })),
    })
    images.value = product.images || []
  }

  async function loadBrands() {
    try {
      brands.value = await adminService.brands()
    } catch {
      // Sin marcas sugeridas el formulario sigue funcionando
    }
  }

  onMounted(async () => {
    loadCategories()
    loadBrands()
    if (!isEdit.value) return
    try {
      fill(await adminService.getProduct(productId.value))
      loading.value = false
      // Recién creado: llevarla directo al bloque de fotos
      if (route.query.fotos) {
        await nextTick()
        document.getElementById('fotos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } catch (e) {
      toast.error((e as ApiError).message)
      router.replace({ name: 'AdminProducts' })
    } finally {
      loading.value = false
    }
  })

  function validate(): boolean {
    errors.name = form.name.trim() ? '' : 'Ponle un nombre al producto'
    const price = inputToCents(form.price)
    errors.price = price !== null && price > 0 ? '' : 'Escribe un precio válido, por ejemplo 19.90'
    errors.shades = shadesError()
    return !errors.name && !errors.price && !errors.shades
  }

  function shadesError(): string {
    const names = form.shades.map((s) => s.name.trim().toLowerCase())
    if (names.some((n) => !n)) return 'Hay un tono sin nombre'
    const repeated = names.find((n, i) => names.indexOf(n) !== i)
    return repeated ? `El tono "${repeated}" está repetido` : ''
  }

  function payload(): ProductPayload {
    const price = inputToCents(form.price) as number
    const compare = inputToCents(form.compareAtPrice)
    return {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category || null,
      description: form.description.trim(),
      price,
      // Un "precio anterior" menor o igual al actual no es una rebaja
      compareAtPrice: compare && compare > price ? compare : null,
      stock: form.stock,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
      tags: form.tags,
      shades: form.shades.map((s) => ({ ...s, name: s.name.trim() })),
    }
  }

  async function save() {
    if (!validate()) {
      toast.error('Revisa los campos marcados')
      return
    }
    saving.value = true
    try {
      if (isEdit.value) {
        fill(await adminService.updateProduct(productId.value, payload()))
        toast.success('Cambios guardados')
      } else {
        const created = await adminService.createProduct(payload())
        toast.success('Producto creado. Ahora súbele fotos')
        router.replace({
          name: 'AdminProductEdit',
          params: { id: created._id },
          query: { fotos: '1' },
        })
      }
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  async function remove() {
    deleting.value = true
    try {
      await adminService.deleteProduct(productId.value)
      toast.success('Producto eliminado')
      router.replace({ name: 'AdminProducts' })
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      deleting.value = false
    }
  }

  function onImagesChange(product: Product) {
    images.value = product.images || []
  }

  return {
    productId,
    isEdit,
    form,
    images,
    brands,
    categories,
    loading,
    saving,
    deleting,
    errors,
    save,
    remove,
    onImagesChange,
  }
}
