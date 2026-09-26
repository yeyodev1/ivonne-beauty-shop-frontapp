<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { whatsappLink } from '@/config/site'
import { formatMoney } from '@/utils/format'
import { cartWhatsappMessage } from './cartMessage'

const emit = defineEmits<{ navigate: [] }>()

const cart = useCartStore()
const router = useRouter()

const whatsappHref = computed(() => whatsappLink(cartWhatsappMessage(cart.items, cart.subtotal)))

function checkout() {
  emit('navigate')
  router.push('/checkout')
}
</script>

<template>
  <div class="summary">
    <div class="summary__row">
      <span>Subtotal</span>
      <strong class="summary__amount">{{ formatMoney(cart.subtotal) }}</strong>
    </div>
    <p class="summary__note">
      <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
      El envío se calcula en el siguiente paso
    </p>
    <button type="button" class="btn btn--primary summary__cta" @click="checkout">
      Finalizar compra <i class="fa-solid fa-arrow-right"></i>
    </button>
    <a :href="whatsappHref" class="btn btn--ghost summary__cta" target="_blank" rel="noopener">
      <i class="fa-brands fa-whatsapp"></i> Pedir por WhatsApp
    </a>
  </div>
</template>

<style scoped lang="scss">
.summary {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__row {
    @include flex(row, baseline, space-between);
    font-size: $text-sm;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__amount {
    font-family: $font-display;
    font-size: $text-xl;
    letter-spacing: 0;
    text-transform: none;
  }

  &__note {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-xs;
    color: $ink-soft;
    margin-bottom: 0.3rem;

    i {
      color: $accent;
    }
  }

  &__cta {
    width: 100%;
    min-height: 50px;
  }
}
</style>
