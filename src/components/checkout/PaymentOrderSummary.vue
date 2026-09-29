<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '@/utils/format'
import { site } from '@/config/site'
import type { Order } from '@/types'

const props = defineProps<{ order: Order }>()

// Qué pasa después según cómo eligió recibir el pedido.
const nextStep = computed(() => {
  const { optionId } = props.order.shipping
  if (optionId === 'pickup') {
    return {
      icon: 'fa-solid fa-store',
      text: `Te avisamos por WhatsApp cuando tu pedido esté listo para retirar en ${site.address.street} (${site.address.reference}).`,
    }
  }
  if (optionId === 'machala') {
    return {
      icon: 'fa-solid fa-motorcycle',
      text: 'Te escribimos por WhatsApp para coordinar la entrega a domicilio en Machala.',
    }
  }
  return {
    icon: 'fa-solid fa-truck-fast',
    text: 'Preparamos tu paquete y te compartimos la guía de Servientrega para que sigas tu envío.',
  }
})
</script>

<template>
  <section class="receipt" aria-label="Resumen del pedido">
    <div class="receipt__next">
      <i :class="nextStep.icon" aria-hidden="true"></i>
      <div>
        <strong>¿Qué sigue?</strong>
        <p>{{ nextStep.text }}</p>
        <p class="receipt__mail">Enviamos la confirmación a {{ order.customer.email }}.</p>
      </div>
    </div>

    <ul class="receipt__lines">
      <li v-for="(item, i) in order.items" :key="i" class="receipt__line">
        <img :src="item.image || '/placeholder-product.svg'" :alt="item.name" loading="lazy" />
        <p>
          <span>{{ item.name }}</span>
          <small v-if="item.shade">Tono: {{ item.shade.name }}</small>
          <small>{{ item.quantity }} x {{ formatMoney(item.price) }}</small>
        </p>
        <strong>{{ formatMoney(item.price * item.quantity) }}</strong>
      </li>
    </ul>

    <dl class="receipt__totals">
      <div><dt>Subtotal</dt><dd>{{ formatMoney(order.subtotal) }}</dd></div>
      <div>
        <dt>{{ order.shipping.label }}</dt>
        <dd>{{ order.shippingCost ? formatMoney(order.shippingCost) : 'Gratis' }}</dd>
      </div>
      <div class="receipt__total"><dt>Total pagado</dt><dd>{{ formatMoney(order.total) }}</dd></div>
    </dl>
  </section>
</template>

<style scoped lang="scss">
.receipt {
  @include card;
  @include flex(column, stretch, flex-start, 1.1rem);
  width: 100%;
  padding: 1.2rem 1rem;
  text-align: left;

  @include from('md') {
    padding: 1.5rem;
  }

  &__next {
    @include flex(row, flex-start, flex-start, 0.8rem);
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.9rem 1rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
      margin-top: 0.25rem;
    }

    strong {
      color: $ink;
    }
  }

  &__mail {
    margin-top: 0.3rem;
    font-size: $text-xs;
    word-break: break-word;
  }

  &__lines {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__line {
    @include flex(row, center, flex-start, 0.75rem);
    font-size: $text-sm;

    img {
      flex: 0 0 48px;
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: $radius-sm;
      background: $sand;
    }

    p {
      @include flex(column, flex-start, flex-start);
      flex: 1;
      min-width: 0;
      line-height: 1.35;
    }

    small {
      color: $ink-muted;
    }

    strong {
      white-space: nowrap;
    }
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.4rem);
    border-top: 1px dashed $line;
    padding-top: 0.9rem;
    font-size: $text-sm;

    > div {
      @include flex(row, baseline, space-between, 1rem);
    }

    dt {
      color: $ink-soft;
    }
  }

  &__total {
    font-size: $text-lg;
    font-weight: 700;

    dt {
      color: $ink !important;
    }
  }
}
</style>
