import { computed, reactive, ref, watch } from 'vue'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { formatMoney } from '@/utils/format'
import { site } from '@/config/site'
import type { ApiError, Order, PayphoneConfig, ShippingOption } from '@/types'

const STORAGE_KEY = 'ivonne_checkout'
export const PICKUP_ID = 'pickup'
const MACHALA_ID = 'machala'

export interface CheckoutForm {
  name: string
  email: string
  phone: string
  documentId: string
  city: string
  street: string
  reference: string
  notes: string
}

type FieldKey = keyof CheckoutForm

// Estado de módulo: los pasos del checkout son componentes separados que
// comparten un único formulario.
const form = reactive<CheckoutForm>({
  name: '',
  email: '',
  phone: '',
  documentId: '',
  city: '',
  street: '',
  reference: '',
  notes: '',
})
const errors = reactive<Partial<Record<FieldKey | 'shipping', string>>>({})
const shippingOptions = ref<ShippingOption[]>([])
const shippingId = ref('')
const loadingSettings = ref(false)
const settingsError = ref('')
const submitting = ref(false)
const submitError = ref('')
const order = ref<Order | null>(null)
const payphone = ref<PayphoneConfig | null>(null)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^09\d{8}$/
const DOCUMENT_RE = /^(\d{10}|\d{13})$/

const onlyDigits = (value: string) => value.replace(/\D/g, '')

function readSaved(): Partial<CheckoutForm> & { shippingId?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveBuyer() {
  try {
    const { name, email, phone, documentId, city, street, reference } = form
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name,
        email,
        phone,
        documentId,
        city,
        street,
        reference,
        shippingId: shippingId.value,
      }),
    )
  } catch {
    // Modo privado: la próxima vez tocará escribirlos de nuevo.
  }
}

const selectedOption = computed(
  () => shippingOptions.value.find((o) => o.id === shippingId.value) || null,
)
const isPickup = computed(() => shippingId.value === PICKUP_ID)

watch(shippingId, (id, previous) => {
  delete errors.shipping
  if (id === MACHALA_ID && !form.city.trim()) form.city = 'Machala'
  // Si venía de Machala con la ciudad por defecto, al pasar a envío nacional se limpia.
  else if (previous === MACHALA_ID && id !== PICKUP_ID && form.city === 'Machala') form.city = ''
})

function validateField(key: FieldKey): boolean {
  const value = form[key].trim()
  let message = ''
  switch (key) {
    case 'name':
      if (value.split(/\s+/).filter(Boolean).length < 2) message = 'Escribe tu nombre y apellido'
      break
    case 'email':
      if (!EMAIL_RE.test(value)) message = 'Revisa tu correo, parece incompleto'
      break
    case 'phone':
      if (!PHONE_RE.test(onlyDigits(value))) message = 'Celular de 10 dígitos que empiece con 09'
      break
    case 'documentId':
      if (!DOCUMENT_RE.test(onlyDigits(value))) message = 'Cédula (10 dígitos) o RUC (13 dígitos)'
      break
    case 'city':
      if (!isPickup.value && value.length < 3) message = 'Indica la ciudad'
      break
    case 'street':
      if (!isPickup.value && value.length < 5) message = 'Escribe la dirección de entrega'
      break
  }
  if (message) errors[key] = message
  else delete errors[key]
  return !message
}

function validate(): boolean {
  const keys: FieldKey[] = ['name', 'email', 'phone', 'documentId', 'city', 'street']
  const results = keys.map(validateField)
  if (!shippingId.value) errors.shipping = 'Elige cómo quieres recibir tu pedido'
  return results.every(Boolean) && Boolean(shippingId.value)
}

export function useCheckout() {
  const cart = useCartStore()
  const userStore = useUserStore()
  const toast = useToastStore()

  const shippingCost = computed(() => order.value?.shippingCost ?? selectedOption.value?.price ?? 0)
  const subtotal = computed(() => order.value?.subtotal ?? cart.subtotal)
  const total = computed(() => order.value?.total ?? subtotal.value + shippingCost.value)

  /** Prellena con lo guardado de la compra anterior y, si hay sesión, con la cuenta. */
  function prefill() {
    const saved = readSaved()
    const user = userStore.user
    for (const key of Object.keys(form) as FieldKey[]) {
      if (!form[key] && typeof saved[key] === 'string') form[key] = saved[key] as string
    }
    if (user) {
      form.name ||= user.name || ''
      form.email ||= user.email || ''
      form.phone ||= user.phone || ''
    }
    if (!shippingId.value && saved.shippingId) shippingId.value = saved.shippingId
  }

  async function loadSettings() {
    loadingSettings.value = true
    settingsError.value = ''
    try {
      const settings = await orderService.getSettings()
      shippingOptions.value = settings.shippingOptions.filter((o) => o.enabled !== false)
      // Si la opción guardada ya no existe, que la clienta elija de nuevo.
      if (shippingId.value && !selectedOption.value) shippingId.value = ''
    } catch (e) {
      settingsError.value = (e as ApiError).message
    } finally {
      loadingSettings.value = false
    }
  }

  async function createOrder(): Promise<boolean> {
    submitError.value = ''
    if (!validate()) {
      toast.error('Revisa los datos marcados antes de continuar')
      return false
    }
    submitting.value = true
    try {
      const result = await orderService.createOrder({
        items: cart.items.map((item) => ({
          productId: item.productId,
          shadeId: item.shadeId || undefined,
          quantity: item.quantity,
        })),
        customer: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: onlyDigits(form.phone),
          documentId: onlyDigits(form.documentId),
        },
        shippingOptionId: shippingId.value,
        address: isPickup.value
          ? { city: 'Machala', street: '', reference: '' }
          : {
              city: form.city.trim(),
              street: form.street.trim(),
              reference: form.reference.trim(),
            },
        notes: form.notes.trim() || undefined,
      })
      order.value = result.order
      payphone.value = result.payphone
      saveBuyer()
      return true
    } catch (e) {
      const error = e as ApiError
      // 400 trae el motivo concreto (p. ej. stock): se muestra junto al botón.
      if (error.status === 400) submitError.value = error.message
      else toast.error(error.message)
      return false
    } finally {
      submitting.value = false
    }
  }

  /** Descarta el intento de pago actual (para editar datos o porque venció). */
  function discardPayment() {
    order.value = null
    payphone.value = null
    submitError.value = ''
  }

  async function renewPayment() {
    discardPayment()
    return createOrder()
  }

  const buyer = computed(() => ({
    email: form.email.trim().toLowerCase(),
    phoneNumber: onlyDigits(form.phone),
    documentId: onlyDigits(form.documentId),
  }))

  /** Mensaje para quien prefiere pagar por transferencia o en tienda. */
  const whatsappMessage = computed(() => {
    const lines = cart.items.map(
      (i) =>
        `• ${i.quantity} x ${i.name}${i.shadeName ? ` · Tono ${i.shadeName}` : ''} (${formatMoney(i.price * i.quantity)})`,
    )
    const delivery = selectedOption.value
      ? `Entrega: ${selectedOption.value.label}${isPickup.value ? '' : ` — ${form.street.trim()}, ${form.city.trim()}`}`
      : ''
    return [
      `${site.whatsappGreeting}. Quiero hacer este pedido y pagar por transferencia o en tienda:`,
      order.value ? `Pedido ${order.value.number}` : '',
      ...lines,
      `Total: ${formatMoney(total.value)}`,
      delivery,
      form.name.trim() ? `Nombre: ${form.name.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  })

  return {
    form,
    errors,
    shippingOptions,
    shippingId,
    selectedOption,
    isPickup,
    loadingSettings,
    settingsError,
    submitting,
    submitError,
    order,
    payphone,
    buyer,
    subtotal,
    shippingCost,
    total,
    whatsappMessage,
    prefill,
    loadSettings,
    validateField,
    createOrder,
    discardPayment,
    renewPayment,
  }
}
