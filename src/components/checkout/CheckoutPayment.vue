<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useCheckout } from '@/composables/useCheckout'
import { whatsappLink } from '@/config/site'
import CheckoutStep from './CheckoutStep.vue'
import PayphoneBox from './PayphoneBox.vue'

const { order, payphone, buyer, submitting, submitError, whatsappMessage, createOrder, discardPayment, renewPayment } =
  useCheckout()

const paymentAnchor = ref<HTMLElement | null>(null)
const waHref = computed(() => whatsappLink(whatsappMessage.value))

async function continueToPayment() {
  const ok = await createOrder()
  if (!ok) {
    // Lleva a la primera casilla con error para que no tenga que buscarla.
    await nextTick()
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  await nextTick()
  paymentAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <CheckoutStep :step="4" title="Pago">
    <div ref="paymentAnchor" class="payment">
      <Transition name="rise">
        <div v-if="submitError" class="payment__error" role="alert">
          <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
          <div>
            <p>{{ submitError }}</p>
            <RouterLink to="/carrito">Ajustar mi carrito</RouterLink>
          </div>
        </div>
      </Transition>

      <template v-if="order && payphone">
        <PayphoneBox
          :config="payphone"
          :buyer="buyer"
          :order-number="order.number"
          :total="payphone.amount"
          :renewing="submitting"
          @renew="renewPayment"
        />
        <button type="button" class="payment__edit" @click="discardPayment">
          <i class="fa-solid fa-pen" aria-hidden="true"></i> Editar mis datos o la entrega
        </button>
      </template>

      <template v-else>
        <p class="payment__note">
          <i class="fa-solid fa-shield-heart" aria-hidden="true"></i>
          Pagas con tarjeta de crédito o débito a través de Payphone. Nunca guardamos los datos de tu tarjeta.
        </p>
        <button type="button" class="btn btn--primary payment__cta" :disabled="submitting" @click="continueToPayment">
          <i v-if="submitting" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
          <i v-else class="fa-solid fa-lock" aria-hidden="true"></i>
          {{ submitting ? 'Preparando tu pago…' : 'Continuar al pago' }}
        </button>
      </template>

      <a class="payment__whatsapp" :href="waHref" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        <span>¿Prefieres pagar por transferencia o en tienda? <strong>Escríbenos por WhatsApp</strong></span>
      </a>
    </div>
  </CheckoutStep>
</template>

<style scoped lang="scss">
.payment {
  @include flex(column, stretch, flex-start, 1rem);
  scroll-margin-top: 90px;

  &__error {
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.8rem 0.9rem;
    border-radius: $radius-sm;

    i {
      margin-top: 0.25rem;
    }

    a {
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }

  &__note {
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
      margin-top: 0.25rem;
    }
  }

  &__cta {
    width: 100%;
    min-height: 52px;
    font-size: 0.95rem;
  }

  &__edit {
    align-self: center;
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__whatsapp {
    @include flex(row, center, flex-start, 0.7rem);
    min-height: 44px;
    padding: 0.75rem 0.9rem;
    border-radius: $radius-sm;
    background: $paper;
    border: 1px dashed $line;
    font-size: $text-sm;
    color: $ink-soft;
    @include transition(border-color);

    &:hover {
      border-color: $accent;
    }

    i {
      font-size: 1.4rem;
      color: #25d366;
    }

    strong {
      color: $ink;
    }
  }
}
</style>
