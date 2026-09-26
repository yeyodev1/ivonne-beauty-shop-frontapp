import { ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import type { Settings } from '@/types'

// Estado de módulo: la barra de anuncio, la ficha de producto y el checkout
// leen lo mismo y solo se pide una vez por carga.
const settings = ref<Settings>({ shippingOptions: [], announcement: '' })
const loaded = ref(false)
let pending: Promise<void> | null = null

async function loadSettings(force = false): Promise<void> {
  if (loaded.value && !force) return
  if (pending) return pending
  pending = catalogService
    .getSettings()
    .then((data) => {
      settings.value = {
        announcement: data.announcement || '',
        shippingOptions: (data.shippingOptions || []).filter((o) => o.enabled !== false),
      }
      loaded.value = true
    })
    .catch(() => {
      // Sin settings la tienda sigue funcionando: sin anuncio ni tabla de envíos.
    })
    .finally(() => {
      pending = null
    })
  return pending
}

export function useSettings() {
  void loadSettings()
  return { settings, loaded, loadSettings }
}
