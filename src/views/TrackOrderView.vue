<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { whatsappLink } from '@/config/site'
import { formatDate } from '@/utils/format'
import FormField from '@/components/checkout/FormField.vue'
import PaymentOrderSummary from '@/components/checkout/PaymentOrderSummary.vue'
import OrderStatusChip from '@/components/account/OrderStatusChip.vue'
import type { ApiError, Order } from '@/types'

const route = useRoute()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const number = ref(typeof route.query.numero === 'string' ? route.query.numero : '')
const loading = ref(false)
const error = ref('')
const order = ref<Order | null>(null)

const PAID_STATES = ['paid', 'preparing', 'shipped', 'delivered']

async function search() {
  error.value = ''
  if (!email.value.trim() || !number.value.trim()) {
    error.value = 'Escribe tu correo y el número de tu pedido'
    return
  }
  loading.value = true
  try {
    order.value = (await orderService.lookup(email.value.trim(), number.value.trim())).order
  } catch (e) {
    order.value = null
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}

const waHelp = () =>
  whatsappLink(`Hola, quiero consultar mi pedido${number.value ? ` ${number.value}` : ''} (${email.value}).`)

// Desde la página de pago llega con los datos en el enlace: se busca solo.
onMounted(() => {
  if (email.value && number.value) search()
})
</script>

<template>
  <section class="track">
    <p class="track__eyebrow">Sin cuenta, sin contraseñas</p>
    <h1 class="track__title">Consulta tu <em>pedido</em></h1>
    <p class="track__lead">
      Escribe el correo con el que compraste y tu número de pedido (empieza con <strong>IB-</strong>; lo ves al
      terminar de pagar).
    </p>

    <form class="track__form" @submit.prevent="search">
      <FormField id="track-email" label="Correo">
        <input id="track-email" v-model="email" type="email" inputmode="email" autocomplete="email" required />
      </FormField>
      <FormField id="track-number" label="Número de pedido" hint="Ej. IB-000012 o solo 12">
        <input id="track-number" v-model="number" type="text" autocomplete="off" placeholder="IB-000012" required />
      </FormField>
      <button class="btn btn--primary" type="submit" :disabled="loading">
        <i :class="loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-magnifying-glass'" aria-hidden="true"></i>
        {{ loading ? 'Buscando…' : 'Buscar mi pedido' }}
      </button>
      <p v-if="error" class="track__error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
        <a :href="waHelp()" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
      </p>
    </form>

    <Transition name="fade">
      <div v-if="order" class="track__result" aria-live="polite">
        <div class="track__head">
          <div>
            <p class="track__number">Pedido {{ order.number }}</p>
            <p class="track__date">{{ formatDate(order.createdAt) }}</p>
          </div>
          <OrderStatusChip :status="order.status" />
        </div>
        <PaymentOrderSummary v-if="PAID_STATES.includes(order.status)" :order="order" />
        <p v-else-if="order.status === 'pending'" class="track__note">
          Este pedido aún no tiene un pago aprobado. Si ya se debitó de tu tarjeta,
          <a :href="waHelp()" target="_blank" rel="noopener">escríbenos</a> y lo revisamos.
        </p>
        <p v-else class="track__note">
          Este pedido fue cancelado y no se hizo ningún cobro.
          <RouterLink to="/tienda">Volver a la tienda</RouterLink>
        </p>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.track {
  @include container(620px);
  @include flex(column, stretch, flex-start, 1rem);
  flex: 1;
  padding-block: $space-lg $space-xl;

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 500);

    em {
      color: $accent;
    }
  }

  &__lead {
    color: $ink-soft;
  }

  &__form {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.2rem 1rem;

    @include from('md') {
      padding: 1.5rem;
    }
  }

  &__error {
    font-size: $text-sm;
    color: $danger;

    a {
      display: block;
      margin-top: 0.3rem;
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
    }
  }

  &__result {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__head {
    @include flex(row, center, space-between, 0.8rem);
  }

  &__number {
    font-weight: 700;
    font-size: $text-lg;
  }

  &__date {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__note {
    @include card;
    padding: 1rem;
    color: $ink-soft;

    a {
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
    }
  }
}
</style>
