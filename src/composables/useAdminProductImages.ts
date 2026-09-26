import { onUnmounted, ref, type Ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product, ProductImage } from '@/types'

// El API acepta hasta 8 archivos por petición
const BATCH = 8

export interface PendingUpload {
  key: string
  name: string
  preview: string
}

/**
 * Fotos de un producto ya guardado: subir (con vista previa y progreso),
 * borrar, elegir portada y agregar por URL.
 */
export function useAdminProductImages(productId: Ref<string>, onChange: (product: Product) => void) {
  const toast = useToastStore()

  const pending = ref<PendingUpload[]>([])
  const progress = ref(0)
  const uploading = ref(false)
  // Error persistente (p. ej. 503 si Cloudinary no está configurado): un toast se pierde
  const uploadError = ref('')
  const busyUrl = ref('')

  function clearPending() {
    pending.value.forEach((item) => URL.revokeObjectURL(item.preview))
    pending.value = []
  }

  async function upload(fileList: FileList | null) {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'))
    if (!files.length || uploading.value) return

    uploadError.value = ''
    uploading.value = true
    progress.value = 0
    pending.value = files.map((file, i) => ({
      key: `${Date.now()}-${i}`,
      name: file.name,
      preview: URL.createObjectURL(file),
    }))

    try {
      for (let start = 0; start < files.length; start += BATCH) {
        const chunk = files.slice(start, start + BATCH)
        const product = await adminService.uploadImages(productId.value, chunk, (percent) => {
          progress.value = Math.round(((start + (chunk.length * percent) / 100) / files.length) * 100)
        })
        onChange(product)
      }
      toast.success(files.length === 1 ? 'Foto subida' : `${files.length} fotos subidas`)
    } catch (e) {
      const error = e as ApiError
      uploadError.value = error.message
      toast.error(error.message)
    } finally {
      uploading.value = false
      clearPending()
    }
  }

  async function remove(image: ProductImage) {
    busyUrl.value = image.url
    try {
      onChange(await adminService.deleteImage(productId.value, image))
      toast.success('Foto eliminada')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      busyUrl.value = ''
    }
  }

  async function makeCover(images: ProductImage[], image: ProductImage) {
    busyUrl.value = image.url
    const ordered = [image, ...images.filter((img) => img.url !== image.url)]
    try {
      onChange(await adminService.reorderImages(productId.value, ordered))
      toast.success('Portada actualizada')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      busyUrl.value = ''
    }
  }

  async function addByUrl(images: ProductImage[], url: string): Promise<boolean> {
    const clean = url.trim()
    if (!/^https?:\/\/\S+$/i.test(clean)) {
      toast.error('Pega un enlace que empiece con https://')
      return false
    }
    if (images.some((img) => img.url === clean)) {
      toast.info('Esa imagen ya está agregada')
      return false
    }
    busyUrl.value = clean
    try {
      const product = await adminService.updateProduct(productId.value, {
        images: [...images, { url: clean, publicId: '' }],
      })
      onChange(product)
      toast.success('Imagen agregada')
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    } finally {
      busyUrl.value = ''
    }
  }

  onUnmounted(clearPending)

  return { pending, progress, uploading, uploadError, busyUrl, upload, remove, makeCover, addByUrl }
}
