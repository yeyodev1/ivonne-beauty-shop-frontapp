<script setup lang="ts">
import { formatDateTime, formatMoney } from '@/utils/format'
import type { Order } from '@/types'

defineProps<{ order: Order }>()
</script>

<template>
  <section class="oitems">
    <h2 class="oitems__title">Productos</h2>
    <ul class="oitems__list">
      <li v-for="item in order.items" :key="`${item.product}-${item.name}`" class="oitems__line">
        <img :src="item.image || '/placeholder-product.svg'" :alt="item.name" loading="lazy" />
        <div class="oitems__info">
          <p class="oitems__brand">{{ item.brand }}</p>
          <p class="oitems__name">{{ item.name }}</p>
          <p class="oitems__qty">{{ item.quantity }} × {{ formatMoney(item.price) }}</p>
        </div>
        <strong class="oitems__sum">{{ formatMoney(item.price * item.quantity) }}</strong>
      </li>
    </ul>
    <dl class="oitems__totals">
      <div><dt>Subtotal</dt><dd>{{ formatMoney(order.subtotal) }}</dd></div>
      <div><dt>Envío</dt><dd>{{ order.shippingCost ? formatMoney(order.shippingCost) : 'Gratis' }}</dd></div>
      <div class="oitems__total"><dt>Total</dt><dd>{{ formatMoney(order.total) }}</dd></div>
    </dl>
    <p class="oitems__paid">
      <i :class="order.paidAt ? 'fa-solid fa-circle-check' : 'fa-regular fa-clock'" aria-hidden="true"></i>
      {{ order.paidAt ? `Pagado el ${formatDateTime(order.paidAt)}` : 'Sin pago registrado' }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.oitems {
  @include card;
  padding: 1rem;

  &__title {
    @include eyebrow;
    margin-bottom: 0.6rem;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.7rem);
  }

  &__line {
    @include flex(row, center, flex-start, 0.7rem);

    img {
      flex: 0 0 52px;
      width: 52px;
      height: 52px;
      border-radius: 10px;
      object-fit: cover;
      background: $sand;
    }
  }

  &__info {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__brand {
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__name {
    font-size: 0.86rem;
    font-weight: 600;
    line-height: 1.3;
  }

  &__qty {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__sum {
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;
  }

  &__totals {
    margin-top: 1rem;
    border-top: 1px solid $line;
    padding-top: 0.7rem;
    @include flex(column, stretch, flex-start, 0.25rem);

    div {
      @include flex(row, center, space-between);
      font-size: $text-sm;
      color: $ink-soft;
    }

    dd {
      font-variant-numeric: tabular-nums;
    }
  }

  &__total {
    margin-top: 0.3rem;
    font-size: 1.05rem !important;
    font-weight: 700;
    color: $ink !important;
  }

  &__paid {
    @include flex(row, center, flex-start, 0.5rem);
    margin-top: 0.8rem;
    font-size: $text-xs;
    color: $ink-soft;

    .fa-circle-check {
      color: $success;
    }
  }
}
</style>
