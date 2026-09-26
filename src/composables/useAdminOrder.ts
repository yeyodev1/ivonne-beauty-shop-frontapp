import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { adminWhatsappLink, orderWhatsappMessage, telLink } from './useAdminContact'
import type { ApiError, Order, OrderStatus } from '@/types'

export function useAdminOrder() {
  const route = useRoute()
  const toast = useToastStore()

  const order = ref<Order | null>(null)
  const loading = ref(true)
  const status = ref<OrderStatus>('pending')
  const updating = ref(false)

  onMounted(async () => {
    try {
      order.value = await adminService.getOrder(String(route.params.id))
      status.value = order.value.status
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  })

  const whatsapp = computed(() =>
    order.value
      ? adminWhatsappLink(order.value.customer.phone, orderWhatsappMessage(order.value.customer.name, order.value.number))
      : '',
  )
  const phone = computed(() => (order.value ? telLink(order.value.customer.phone) : ''))

  const payphoneJson = computed(() => {
    const data = order.value?.payphone
    if (data === undefined || data === null) return ''
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  })

  async function updateStatus() {
    if (!order.value || status.value === order.value.status) return
    updating.value = true
    try {
      const updated = await adminService.updateOrderStatus(order.value._id, status.value)
      // El PATCH puede no traer `payphone`: se conserva el que ya teníamos
      order.value = { ...order.value, ...updated, payphone: updated.payphone ?? order.value.payphone }
      toast.success(
        ['shipped', 'delivered'].includes(status.value)
          ? 'Estado actualizado. Le avisamos a la clienta por correo'
          : 'Estado actualizado',
      )
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      updating.value = false
    }
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(payphoneJson.value)
      toast.success('Copiado')
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  return { order, loading, status, updating, whatsapp, phone, payphoneJson, updateStatus, copyJson }
}
