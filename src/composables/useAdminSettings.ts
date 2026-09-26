import { onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { centsToInput, inputToCents } from '@/utils/format'
import type { ApiError, Settings } from '@/types'

export interface ShippingDraft {
  id: string
  label: string
  description: string
  price: string
  enabled: boolean
}

/** Ajustes de la tienda: anuncio de la barra superior y opciones de envío. */
export function useAdminSettings() {
  const toast = useToastStore()

  const announcement = ref('')
  const shipping = ref<ShippingDraft[]>([])
  const loading = ref(true)
  const saving = ref(false)

  function fill(settings: Settings) {
    announcement.value = settings.announcement || ''
    shipping.value = (settings.shippingOptions || []).map((option) => ({
      ...option,
      price: centsToInput(option.price),
    }))
  }

  onMounted(async () => {
    try {
      fill(await adminService.getSettings())
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  })

  async function save() {
    const invalid = shipping.value.find((o) => !o.label.trim() || inputToCents(o.price || '0') === null)
    if (invalid) {
      toast.error('Cada envío necesita un nombre y un precio válido (0 si es gratis)')
      return
    }
    if (!shipping.value.some((o) => o.enabled)) {
      toast.error('Deja al menos una opción de envío habilitada')
      return
    }
    saving.value = true
    try {
      const saved = await adminService.updateSettings({
        announcement: announcement.value.trim(),
        shippingOptions: shipping.value.map((o) => ({
          id: o.id,
          label: o.label.trim(),
          description: o.description.trim(),
          price: inputToCents(o.price || '0') ?? 0,
          enabled: o.enabled,
        })),
      })
      fill(saved)
      toast.success('Ajustes guardados')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  return { announcement, shipping, loading, saving, save }
}
