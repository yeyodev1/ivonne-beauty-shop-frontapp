<script setup lang="ts">
import AdminOrderStatus from './AdminOrderStatus.vue'
import { formatDateTime, formatMoney } from '@/utils/format'
import type { Order } from '@/types'

defineProps<{ order: Order }>()

const SHIPPING_ICONS: Record<string, string> = {
  pickup: 'fa-solid fa-store',
  machala: 'fa-solid fa-motorcycle',
  nacional: 'fa-solid fa-truck',
}
</script>

<template>
  <RouterLink :to="{ name: 'AdminOrderDetail', params: { id: order._id } }" class="order">
    <div class="order__top">
      <span class="order__number">{{ order.number }}</span>
      <AdminOrderStatus :status="order.status" />
    </div>
    <p class="order__customer">{{ order.customer.name }}</p>
    <div class="order__bottom">
      <span class="order__meta">
        <i class="fa-regular fa-clock" aria-hidden="true"></i>
        {{ formatDateTime(order.createdAt) }}
      </span>
      <span class="order__meta">
        <i :class="SHIPPING_ICONS[order.shipping?.optionId] || 'fa-solid fa-truck'" aria-hidden="true"></i>
        {{ order.shipping?.label }}
      </span>
      <strong class="order__total">{{ formatMoney(order.total) }}</strong>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.order {
  @include card;
  @include flex(column, stretch, flex-start, 0.3rem);
  padding: 0.9rem 1rem;
  @include transition(border-color);
  @include focus-ring;

  &:hover {
    border-color: $blush;
  }

  &__top {
    @include flex(row, center, space-between, 0.5rem);
  }

  &__number {
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
  }

  &__customer {
    font-size: $text-sm;
    color: $ink;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__bottom {
    @include flex(row, center, flex-start, 0.3rem 0.9rem);
    flex-wrap: wrap;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.35rem);
    font-size: 0.74rem;
    color: $ink-muted;

    i {
      font-size: 0.7rem;
    }
  }

  &__total {
    margin-left: auto;
    font-size: 1rem;
    color: $ink;
    font-variant-numeric: tabular-nums;
  }
}
</style>
