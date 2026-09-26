<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import { formatMoney } from '@/utils/format'
import CheckoutStep from './CheckoutStep.vue'

const cart = useCartStore()
const { subtotal, shippingCost, total, selectedOption } = useCheckout()

// En móvil arranca cerrado para no empujar el pago hacia abajo; en escritorio siempre visible.
const open = ref(false)
</script>

<template>
  <CheckoutStep :step="3" title="Tu pedido" :subtitle="`${cart.count} ${cart.count === 1 ? 'producto' : 'productos'}`">
    <template #aside>
      <button
        type="button"
        class="summary__toggle"
        :aria-expanded="open"
        aria-controls="summary-lines"
        @click="open = !open"
      >
        {{ open ? 'Ocultar' : 'Ver detalle' }}
        <i class="fa-solid fa-chevron-down" :class="{ 'summary__chevron--open': open }" aria-hidden="true"></i>
      </button>
    </template>

    <ul id="summary-lines" class="summary__lines" :class="{ 'summary__lines--open': open }">
      <li v-for="item in cart.items" :key="item.productId" class="summary__line">
        <div class="summary__thumb">
          <img :src="item.image || '/placeholder-product.svg'" :alt="item.name" loading="lazy" />
          <span class="summary__qty" :aria-label="`Cantidad ${item.quantity}`">{{ item.quantity }}</span>
        </div>
        <div class="summary__info">
          <small v-if="item.brand">{{ item.brand }}</small>
          <p>{{ item.name }}</p>
        </div>
        <strong class="summary__price">{{ formatMoney(item.price * item.quantity) }}</strong>
      </li>
    </ul>

    <dl class="summary__totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{{ formatMoney(subtotal) }}</dd>
      </div>
      <div>
        <dt>Envío</dt>
        <dd v-if="!selectedOption" class="summary__muted">Elige una opción</dd>
        <dd v-else>{{ shippingCost ? formatMoney(shippingCost) : 'Gratis' }}</dd>
      </div>
      <div class="summary__total">
        <dt>Total</dt>
        <dd>{{ formatMoney(total) }}</dd>
      </div>
    </dl>
  </CheckoutStep>
</template>

<style scoped lang="scss">
.summary {
  &__toggle {
    @include flex(row, center, center, 0.4rem);
    min-height: 44px;
    padding-inline: 0.4rem;
    font-size: $text-xs;
    font-weight: 600;
    color: $accent-deep;
    white-space: nowrap;

    @include from('lg') {
      display: none;
    }

    i {
      @include transition(transform);
    }
  }

  &__chevron--open {
    transform: rotate(180deg);
  }

  &__lines {
    list-style: none;
    display: none;
    flex-direction: column;
    gap: 0.85rem;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px dashed $line;

    &--open {
      display: flex;
    }

    @include from('lg') {
      display: flex;
    }
  }

  &__line {
    @include flex(row, center, flex-start, 0.75rem);
  }

  &__thumb {
    position: relative;
    flex: 0 0 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: $radius-sm;
      background: $sand;
    }
  }

  &__qty {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 20px;
    height: 20px;
    padding-inline: 5px;
    border-radius: $radius-pill;
    background: $ink;
    color: $surface;
    font-size: 0.7rem;
    font-weight: 700;
    @include flex(row, center, center);
  }

  &__info {
    flex: 1;
    min-width: 0;

    small {
      font-size: $text-xs;
      color: $ink-muted;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    p {
      font-size: $text-sm;
      line-height: 1.35;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__price {
    font-size: $text-sm;
    white-space: nowrap;
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.45rem);
    font-size: $text-sm;

    > div {
      @include flex(row, baseline, space-between, 1rem);
    }

    dt {
      color: $ink-soft;
    }
  }

  &__muted {
    color: $ink-muted;
  }

  &__total {
    padding-top: 0.6rem;
    margin-top: 0.2rem;
    border-top: 1px solid $line;
    font-size: $text-lg;
    font-weight: 700;

    dt {
      color: $ink !important;
      font-weight: 600;
    }
  }
}
</style>
