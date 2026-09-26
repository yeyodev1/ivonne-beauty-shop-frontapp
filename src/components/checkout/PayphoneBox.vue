<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { usePayphone, type PayphoneBuyer } from '@/composables/usePayphone'
import { formatMoney } from '@/utils/format'
import type { PayphoneConfig } from '@/types'

const props = defineProps<{
  config: PayphoneConfig
  buyer: PayphoneBuyer
  orderNumber: string
  total: number
  renewing?: boolean
}>()

const emit = defineEmits<{ renew: [] }>()

const CONTAINER_ID = 'pp-button'
const { status, error, countdown, render } = usePayphone()

const mount = () => render(CONTAINER_ID, props.config, props.buyer)

onMounted(mount)
// Una orden nueva trae otro clientTransactionId: se vuelve a montar la Cajita.
watch(() => props.config.clientTransactionId, mount)
</script>

<template>
  <div class="paybox">
    <header class="paybox__head">
      <div class="paybox__lock" aria-hidden="true"><i class="fa-solid fa-lock"></i></div>
      <div class="paybox__titles">
        <h3 class="paybox__title">Paga con tarjeta de forma segura</h3>
        <p class="paybox__meta">
          Pedido <strong>{{ orderNumber }}</strong> · Total <strong>{{ formatMoney(total) }}</strong>
        </p>
      </div>
    </header>

    <div class="paybox__brands" aria-label="Aceptamos Visa, Mastercard, American Express y Diners Club">
      <i class="fa-brands fa-cc-visa" aria-hidden="true"></i>
      <i class="fa-brands fa-cc-mastercard" aria-hidden="true"></i>
      <i class="fa-brands fa-cc-amex" aria-hidden="true"></i>
      <i class="fa-brands fa-cc-diners-club" aria-hidden="true"></i>
      <span>Procesado por Payphone</span>
    </div>

    <div v-if="status === 'loading'" class="paybox__state" aria-live="polite">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Preparando el formulario de pago…
    </div>

    <div v-else-if="status === 'error'" class="paybox__state paybox__state--error" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="btn btn--ghost" @click="mount">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reintentar
      </button>
    </div>

    <div v-else-if="status === 'expired'" class="paybox__state paybox__state--expired" role="alert">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      <p>El formulario de pago venció por seguridad (dura 10 minutos). Genera uno nuevo para continuar, tu carrito sigue intacto.</p>
      <button type="button" class="btn btn--primary" :disabled="renewing" @click="emit('renew')">
        <i v-if="renewing" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        Generar nuevo pago
      </button>
    </div>

    <p v-if="status === 'ready'" class="paybox__timer" aria-live="off">
      <i class="fa-regular fa-clock" aria-hidden="true"></i> Tienes {{ countdown }} para completar el pago
    </p>

    <div :id="CONTAINER_ID" class="paybox__widget" :class="{ 'paybox__widget--hidden': status !== 'ready' }"></div>
  </div>
</template>

<style scoped lang="scss">
.paybox {
  @include flex(column, stretch, flex-start, 1rem);
  border: 1.5px solid rgba($accent, 0.35);
  border-radius: $radius-md;
  background: linear-gradient(180deg, $sand 0%, $surface 140px);
  padding: 1.1rem 0.9rem;

  @include from('md') {
    padding: 1.4rem 1.3rem;
  }

  &__head {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__lock {
    @include flex(row, center, center);
    flex: 0 0 40px;
    height: 40px;
    border-radius: 50%;
    background: $accent;
    color: $surface;
  }

  &__titles {
    min-width: 0;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 600;
  }

  &__meta {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__brands {
    @include flex(row, center, flex-start, 0.55rem);
    flex-wrap: wrap;
    font-size: 1.6rem;
    color: $ink-soft;

    span {
      font-size: $text-xs;
      color: $ink-muted;
      margin-left: 0.2rem;
    }
  }

  &__state {
    @include flex(column, center, center, 0.8rem);
    text-align: center;
    padding: 1.4rem 0.6rem;
    font-size: $text-sm;
    color: $ink-soft;

    &--error {
      color: $danger;
    }

    &--expired i {
      font-size: 1.6rem;
      color: $warning;
    }
  }

  &__timer {
    @include flex(row, center, center, 0.4rem);
    font-size: $text-xs;
    color: $ink-soft;
    background: $surface;
    border-radius: $radius-pill;
    padding: 0.35rem 0.8rem;
    align-self: center;
  }

  &__widget {
    width: 100%;
    min-width: 0;

    &--hidden {
      display: none;
    }

    // Ajustes mínimos al formulario de Payphone: ancho completo y la tipografía de la marca.
    :deep(*) {
      font-family: $font-principal;
      max-width: 100%;
    }

    :deep(form),
    :deep(iframe) {
      width: 100% !important;
    }

    :deep(input),
    :deep(select) {
      border-radius: $radius-sm;
      font-size: 1rem;
    }

    :deep(button) {
      border-radius: $radius-pill;
    }
  }
}
</style>
