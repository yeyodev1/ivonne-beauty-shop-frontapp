import { reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAdminCategories } from './useAdminCategories'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Category } from '@/types'

/** Crear, editar, subir imagen y eliminar categorías desde la hoja inferior. */
export function useAdminCategoryEditor() {
  const toast = useToastStore()
  const { categories, upsert, remove: removeLocal } = useAdminCategories()

  const open = ref(false)
  const editing = ref<Category | null>(null)
  const form = reactive({ name: '', description: '', order: 0, isActive: true })
  const saving = ref(false)
  const uploading = ref(false)
  const deleting = ref<Category | null>(null)

  function start(category: Category | null = null) {
    editing.value = category
    Object.assign(form, {
      name: category?.name || '',
      description: category?.description || '',
      // Nuevas al final de la lista por defecto
      order: category ? category.order : categories.value.reduce((max, c) => Math.max(max, c.order), 0) + 1,
      isActive: category ? category.isActive : true,
    })
    open.value = true
  }

  async function save() {
    if (!form.name.trim()) {
      toast.error('Ponle un nombre a la categoría')
      return
    }
    saving.value = true
    const payload = { ...form, name: form.name.trim(), description: form.description.trim(), order: Number(form.order) || 0 }
    try {
      if (editing.value) {
        const updated = await adminService.updateCategory(editing.value._id, payload)
        upsert(updated)
        toast.success('Categoría actualizada')
        open.value = false
      } else {
        const created = await adminService.createCategory(payload)
        upsert({ productCount: 0, ...created })
        // Queda abierta en modo edición para que pueda subir la imagen enseguida
        editing.value = created
        toast.success('Categoría creada. Puedes agregarle una imagen')
      }
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  async function uploadImage(file: File | undefined) {
    if (!file || !editing.value) return
    uploading.value = true
    try {
      const updated = await adminService.uploadCategoryImage(editing.value._id, file)
      editing.value = updated
      upsert(updated)
      toast.success('Imagen actualizada')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      uploading.value = false
    }
  }

  async function toggleActive(category: Category) {
    try {
      upsert(await adminService.updateCategory(category._id, { isActive: !category.isActive }))
      toast.success(category.isActive ? 'Categoría oculta' : 'Categoría visible en la tienda')
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  async function confirmDelete() {
    const category = deleting.value
    if (!category) return
    deleting.value = null
    try {
      await adminService.deleteCategory(category._id)
      removeLocal(category._id)
      toast.success('Categoría eliminada')
    } catch (e) {
      // 400 si todavía tiene productos: el mensaje del API lo explica
      toast.error((e as ApiError).message)
    }
  }

  return { open, editing, form, saving, uploading, deleting, start, save, uploadImage, toggleActive, confirmDelete }
}
