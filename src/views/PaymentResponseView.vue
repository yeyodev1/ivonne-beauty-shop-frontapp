<script lang="ts">
import type { Order } from '@/types'

// Nivel de módulo: si la vista se monta dos veces (HMR, doble navegación) se
// reutiliza la misma confirmación en vez de pegarle dos veces al backend.
const inFlight = new Map<string, Promise<{ order: Order }>>()
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { whatsappLink } from '@/config/site'
import PaymentStatus from '@/components/checkout/PaymentStatus.vue'
import PaymentOrderSummary from '@/components/checkout/PaymentOrderSummary.vue'
import type { ApiError } from '@/types'

type State = 'confirming' | 'approved' | 'canceled' | 'error'

const route = useRoute()
const cart = useCartStore()

const state = ref<State>('confirming')
const order = ref<Order | null>(null)
const errorMessage = ref('')

const PAID_STATES = ['paid', 'preparing', 'shipped', 'delivered']

const waDelivery = computed(() =>
  whatsappLink(`Hola, acabo de pagar mi pedido ${order.value?.number ?? ''} en la web. Quiero coordinar mi entrega.`),
)
const waHelp = computed(() => {
  const ctid = typeof route.query.clientTransactionId === 'string' ? route.query.clientTransactionId : ''
  return whatsappLink(
    `Hola, tuve un problema al pagar en la web${ctid ? ` (referencia ${ctid})` : ''}. ¿Me ayudan a revisar mi pedido?`,
  )
})

async function confirm() {
  const rawId = route.query.id
  const ctid = route.query.clientTransactionId
  const id = Number(rawId)

  if (typeof ctid !== 'string' || !ctid || !Number.isFinite(id) || typeof rawId !== 'string') {
    state.value = 'error'
    errorMessage.value = 'No encontramos los datos de tu pago en el enlace. Si se hizo un cobro, escríbenos y lo revisamos.'
    return
  }

  const key = `${id}:${ctid}`
  let request = inFlight.get(key)
  if (!request) {
    request = orderService.confirm(id, ctid)
    inFlight.set(key, request)
    request.catch(() => inFlight.delete(key))
  }

  try {
    const result = await request
    order.value = result.order
    if (PAID_STATES.includes(result.order.status)) {
      state.value = 'approved'
      cart.clear()
    } else if (result.order.status === 'canceled') {
      state.value = 'canceled'
    } else {
      state.value = 'error'
      errorMessage.value = 'Tu pago aún no aparece como aprobado. Si ya se debitó de tu tarjeta, escríbenos y lo revisamos.'
    }
  } catch (e) {
    state.value = 'error'
    errorMessage.value = (e as ApiError).message
  }
}

// Sin esperar ningún clic: Payphone reversa el cobro si no se confirma en 5 minutos.
onMounted(confirm)
</script>

<template>
  <section class="response">
    <Transition name="fade" mode="out-in">
      <PaymentStatus
        v-if="state === 'confirming'"
        key="confirming"
        tone="loading"
        title="Confirmando tu pago…"
        text="Esto toma unos segundos. No cierres ni recargues esta página."
      />

      <div v-else-if="state === 'approved' && order" key="approved" class="response__approved">
        <PaymentStatus
          tone="success"
          :title="`¡Gracias, bella! Tu pedido ${order.number} está confirmado`"
          :text="`Guarda tu número de pedido ${order.number}: con él y tu correo puedes consultar tu compra cuando quieras.`"
        >
          <a class="btn btn--primary" :href="waDelivery" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Coordinar mi entrega
          </a>
          <RouterLink
            :to="{ name: 'TrackOrder', query: { email: order.customer.email, numero: order.number } }"
            class="btn btn--ghost"
          >
            Consultar mi pedido
          </RouterLink>
          <RouterLink to="/tienda" class="response__link">Seguir comprando</RouterLink>
        </PaymentStatus>
        <PaymentOrderSummary :order="order" />
      </div>

      <PaymentStatus
        v-else-if="state === 'canceled'"
        key="canceled"
        tone="warning"
        title="Tu pago no se completó"
        text="El pago fue cancelado o rechazado y no se hizo ningún cobro. Tus productos siguen en el carrito para que lo intentes otra vez."
      >
        <RouterLink to="/checkout" class="btn btn--primary">Intentar de nuevo</RouterLink>
        <a class="btn btn--ghost" :href="waHelp" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Pagar por transferencia
        </a>
      </PaymentStatus>

      <PaymentStatus v-else key="error" tone="error" title="No pudimos confirmar tu pago" :text="errorMessage">
        <a class="btn btn--primary" :href="waHelp" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Escríbenos por WhatsApp
        </a>
        <RouterLink to="/checkout" class="btn btn--ghost">Volver al checkout</RouterLink>
      </PaymentStatus>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.response {
  @include container(620px);
  @include flex(column, stretch, center);
  flex: 1;
  min-height: 70vh;
  padding-block: $space-lg $space-xl;

  &__approved {
    @include flex(column, center, flex-start, 1.8rem);
  }

  &__link {
    @include flex(row, center, center);
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
