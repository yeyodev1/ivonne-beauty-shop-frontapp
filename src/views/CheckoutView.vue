<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import CheckoutCustomer from '@/components/checkout/CheckoutCustomer.vue'
import CheckoutDelivery from '@/components/checkout/CheckoutDelivery.vue'
import CheckoutSummary from '@/components/checkout/CheckoutSummary.vue'
import CheckoutPayment from '@/components/checkout/CheckoutPayment.vue'

const router = useRouter()
const cart = useCartStore()
const { prefill, loadSettings, discardPayment } = useCheckout()

onMounted(() => {
  if (cart.isEmpty) {
    router.replace('/carrito')
    return
  }
  // Cada visita al checkout arranca un intento nuevo: una Cajita vieja ya no sirve.
  discardPayment()
  prefill()
  loadSettings()
})
</script>

<template>
  <div class="checkout">
    <header class="checkout__head">
      <RouterLink to="/carrito" class="checkout__back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Volver al carrito
      </RouterLink>
      <p class="checkout__eyebrow">Compra segura</p>
      <h1 class="checkout__title">Finalizar <em>compra</em></h1>
    </header>

    <div v-if="!cart.isEmpty" class="checkout__layout">
      <div class="checkout__col">
        <CheckoutCustomer />
        <CheckoutDelivery />
      </div>
      <div class="checkout__col checkout__col--aside">
        <CheckoutSummary />
        <CheckoutPayment />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkout {
  @include container(1120px);
  padding-block: 1.5rem $space-xl;

  @include from('md') {
    padding-top: 2.5rem;
  }

  &__head {
    margin-bottom: 1.4rem;
  }

  &__back {
    @include flex(row, center, flex-start, 0.45rem);
    display: inline-flex;
    min-height: 44px;
    font-size: $text-sm;
    color: $ink-soft;

    &:hover {
      color: $accent-deep;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-top: 0.4rem;
  }

  &__title {
    @include display($display-sm, 500);
    margin-top: 0.3rem;

    em {
      font-style: italic;
      color: $accent;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  &__col {
    @include flex(column, stretch, flex-start, 1rem);
    min-width: 0;

    @include from('lg') {
      flex: 1 1 58%;
      gap: 1.5rem;

      &--aside {
        flex: 1 1 42%;
      }
    }
  }
}
</style>
