import { computed, getCurrentScope, onScopeDispose, ref } from 'vue'
import type { PayphoneConfig } from '@/types'

const CSS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const JS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'
const LOAD_TIMEOUT = 15000
// La Cajita vence a los 10 minutos: pasado eso hay que crear otra orden.
export const PAYPHONE_TTL = 10 * 60 * 1000

export interface PayphoneBuyer {
  email: string
  phoneNumber: string
  documentId: string
}

export type PayphoneStatus = 'idle' | 'loading' | 'ready' | 'expired' | 'error'

// Estado de módulo: el CSS y el JS se inyectan una sola vez por carga de la web.
let loader: Promise<void> | null = null

function ensureStylesheet() {
  if (document.querySelector(`link[href="${CSS_URL}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = CSS_URL
  document.head.appendChild(link)
}

function loadPayphone(): Promise<void> {
  ensureStylesheet()
  if (window.PPaymentButtonBox) return Promise.resolve()
  if (loader) return loader

  loader = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${JS_URL}"]`)
    if (!script) {
      script = document.createElement('script')
      script.type = 'module'
      script.src = JS_URL
      document.head.appendChild(script)
    }

    let failed = false
    script.addEventListener('error', () => {
      failed = true
    })

    // El módulo expone la clase en window cuando termina de evaluarse.
    const startedAt = Date.now()
    const tick = () => {
      if (window.PPaymentButtonBox) return resolve()
      if (failed || Date.now() - startedAt > LOAD_TIMEOUT) {
        script?.remove()
        return reject(new Error('No se pudo cargar el formulario de pago. Revisa tu conexión e intenta de nuevo.'))
      }
      setTimeout(tick, 100)
    }
    tick()
  }).catch((error) => {
    loader = null
    throw error
  })

  return loader
}

/** Payphone espera el celular con código de país: 0991234567 → +593991234567. */
export function toInternationalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('593')) return `+${digits}`
  if (digits.startsWith('0')) return `+593${digits.slice(1)}`
  return `+593${digits}`
}

export function usePayphone() {
  const status = ref<PayphoneStatus>('idle')
  const error = ref('')
  const remaining = ref(0)
  let expiresAt = 0
  let timer: ReturnType<typeof setInterval> | null = null
  let lastContainer = ''

  const countdown = computed(() => {
    const total = Math.max(0, Math.ceil(remaining.value / 1000))
    const minutes = Math.floor(total / 60)
    const seconds = String(total % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  function stopTimer() {
    if (timer) clearInterval(timer)
    timer = null
  }

  function expire() {
    stopTimer()
    remaining.value = 0
    status.value = 'expired'
    // El formulario vencido ya no sirve: se quita para que nadie intente pagar ahí.
    const container = lastContainer ? document.getElementById(lastContainer) : null
    if (container) container.innerHTML = ''
  }

  function startTimer() {
    stopTimer()
    expiresAt = Date.now() + PAYPHONE_TTL
    remaining.value = PAYPHONE_TTL
    timer = setInterval(() => {
      remaining.value = expiresAt - Date.now()
      if (remaining.value <= 0) expire()
    }, 1000)
  }

  async function render(containerId: string, config: PayphoneConfig, buyer: PayphoneBuyer) {
    status.value = 'loading'
    error.value = ''
    lastContainer = containerId
    try {
      await loadPayphone()
      const container = document.getElementById(containerId)
      const Box = window.PPaymentButtonBox
      if (!container || !Box) throw new Error('No se pudo preparar el formulario de pago.')
      container.innerHTML = ''

      const box = new Box({
        token: config.token,
        clientTransactionId: config.clientTransactionId,
        amount: config.amount,
        amountWithoutTax: config.amountWithoutTax,
        currency: config.currency,
        storeId: config.storeId,
        reference: config.reference,
        lang: 'es',
        defaultMethod: 'card',
        timeZone: -5,
        // Siempre los datos reales del comprador: Payphone bloquea datos fijos.
        email: buyer.email,
        phoneNumber: toInternationalPhone(buyer.phoneNumber),
        documentId: buyer.documentId,
      })
      box.render(containerId)
      status.value = 'ready'
      startTimer()
    } catch (e) {
      status.value = 'error'
      error.value = (e as Error).message || 'No se pudo cargar el formulario de pago.'
    }
  }

  function reset() {
    stopTimer()
    status.value = 'idle'
    error.value = ''
    remaining.value = 0
  }

  if (getCurrentScope()) onScopeDispose(stopTimer)

  return { status, error, remaining, countdown, render, reset }
}
