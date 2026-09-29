<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatDate, formatMoney } from '@/utils/format'
import OrderStatusChip from './OrderStatusChip.vue'
import type { Order } from '@/types'

const props = defineProps<{ order: Order }>()

const open = ref(false)
const MAX_THUMBS = 4
const thumbs = computed(() => props.order.items.slice(0, MAX_THUMBS))
const extra = computed(() => Math.max(0, props.order.items.length - MAX_THUMBS))
const units = computed(() => props.order.items.reduce((acc, item) => acc + item.quantity, 0))
const isPickup = computed(() => props.order.shipping.optionId === 'pickup')
</script>

<template>
  <article class="order" :class="{ 'order--open': open }">
    <button
      type="button"
      class="order__head"
      :aria-expanded="open"
      :aria-controls="`order-${order._id}`"
      @click="open = !open"
    >
      <div class="order__top">
        <strong class="order__number">{{ order.number }}</strong>
        <OrderStatusChip :status="order.status" />
      </div>
      <div class="order__meta">
        <span>{{ formatDate(order.createdAt) }} · {{ units }} {{ units === 1 ? 'producto' : 'productos' }}</span>
        <strong>{{ formatMoney(order.total) }}</strong>
      </div>
      <div class="order__thumbs">
        <img v-for="(item, i) in thumbs" :key="i" :src="item.image || '/placeholder-product.svg'" :alt="item.name" loading="lazy" />
        <span v-if="extra" class="order__extra">+{{ extra }}</span>
        <i class="fa-solid fa-chevron-down order__chevron" aria-hidden="true"></i>
      </div>
    </button>

    <div v-show="open" :id="`order-${order._id}`" class="order__body">
      <ul class="order__lines">
        <li v-for="(item, i) in order.items" :key="i">
          <RouterLink :to="`/producto/${item.slug}`">
            {{ item.name }}<template v-if="item.shade"> · Tono {{ item.shade.name }}</template>
          </RouterLink>
          <span>{{ item.quantity }} x {{ formatMoney(item.price) }}</span>
        </li>
      </ul>
      <dl class="order__totals">
        <div><dt>Subtotal</dt><dd>{{ formatMoney(order.subtotal) }}</dd></div>
        <div><dt>{{ order.shipping.label }}</dt><dd>{{ order.shippingCost ? formatMoney(order.shippingCost) : 'Gratis' }}</dd></div>
        <div class="order__total"><dt>Total</dt><dd>{{ formatMoney(order.total) }}</dd></div>
      </dl>
      <p class="order__address">
        <i :class="isPickup ? 'fa-solid fa-store' : 'fa-solid fa-location-dot'" aria-hidden="true"></i>
        <span v-if="isPickup">Retiro en tienda</span>
        <span v-else>
          {{ order.address.street }}, {{ order.address.city }}
          <template v-if="order.address.reference"> · {{ order.address.reference }}</template>
        </span>
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.order {
  @include card;
  overflow: hidden;
  @include transition(box-shadow);

  &--open {
    box-shadow: $shadow-sm;
  }

  &__head {
    @include flex(column, stretch, flex-start, 0.55rem);
    width: 100%;
    padding: 1rem;
    text-align: left;
  }

  &__top,
  &__meta {
    @include flex(row, center, space-between, 0.6rem);
  }

  &__number {
    font-size: $text-base;
    letter-spacing: 0.02em;
  }

  &__meta {
    font-size: $text-sm;
    color: $ink-soft;

    strong {
      color: $ink;
    }
  }

  &__thumbs {
    @include flex(row, center, flex-start, 0.4rem);

    img {
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: $radius-sm;
      background: $sand;
    }
  }

  &__extra {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
  }

  &__chevron {
    margin-left: auto;
    color: $ink-muted;
    @include transition(transform);

    .order--open & {
      transform: rotate(180deg);
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.9rem);
    padding: 0 1rem 1rem;
    border-top: 1px dashed $line;
    padding-top: 0.9rem;
    font-size: $text-sm;
  }

  &__lines {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.45rem);

    li {
      @include flex(row, baseline, space-between, 0.8rem);
    }

    a {
      min-width: 0;
      text-decoration: underline;
      text-decoration-color: $line;
      text-underline-offset: 3px;
    }

    span {
      color: $ink-soft;
      white-space: nowrap;
    }
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.3rem);

    > div {
      @include flex(row, baseline, space-between, 1rem);
    }

    dt {
      color: $ink-soft;
    }
  }

  &__total {
    font-weight: 700;

    dt {
      color: $ink !important;
    }
  }

  &__address {
    @include flex(row, flex-start, flex-start, 0.5rem);
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.7rem 0.8rem;
    color: $ink-soft;

    i {
      color: $accent;
      margin-top: 0.25rem;
    }
  }
}
</style>
