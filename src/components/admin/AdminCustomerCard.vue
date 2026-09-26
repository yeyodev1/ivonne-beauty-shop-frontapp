<script setup lang="ts">
import { computed } from 'vue'
import { adminWhatsappLink } from '@/composables/useAdminContact'
import { formatDate, formatMoney } from '@/utils/format'
import type { AdminCustomer } from '@/types'

const props = defineProps<{ customer: AdminCustomer }>()

const whatsapp = computed(() =>
  adminWhatsappLink(props.customer.phone, `Hola ${props.customer.name.split(' ')[0]}, te escribimos de Ivonne Beauty Shop`),
)
const initials = computed(() =>
  props.customer.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <article class="cust">
    <span class="cust__avatar" aria-hidden="true">{{ initials }}</span>
    <div class="cust__info">
      <p class="cust__name">{{ customer.name }}</p>
      <a class="cust__email" :href="`mailto:${customer.email}`">{{ customer.email }}</a>
      <a v-if="whatsapp" class="cust__wa" :href="whatsapp" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ customer.phone }}
      </a>
      <p class="cust__since">Desde {{ formatDate(customer.createdAt) }}</p>
    </div>
    <div class="cust__stats">
      <strong>{{ formatMoney(customer.totalSpent) }}</strong>
      <span>{{ customer.ordersCount }} {{ customer.ordersCount === 1 ? 'pedido' : 'pedidos' }}</span>
    </div>
  </article>
</template>

<style scoped lang="scss">
.cust {
  @include card;
  @include flex(row, flex-start, flex-start, 0.75rem);
  padding: 0.9rem;

  &__avatar {
    @include flex(row, center, center);
    flex: 0 0 42px;
    height: 42px;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 0.8rem;
    font-weight: 700;
  }

  &__info {
    flex: 1 1 auto;
    min-width: 0;
    @include flex(column, flex-start, flex-start, 0.1rem);
  }

  &__name {
    font-weight: 600;
    font-size: 0.92rem;
  }

  &__email {
    font-size: $text-xs;
    color: $ink-soft;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__wa {
    @include flex(row, center, flex-start, 0.35rem);
    min-height: 32px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #1a9e4b;
  }

  &__since {
    font-size: 0.68rem;
    color: $ink-muted;
  }

  &__stats {
    @include flex(column, flex-end, flex-start, 0.1rem);
    text-align: right;

    strong {
      font-size: 0.95rem;
      font-variant-numeric: tabular-nums;
    }

    span {
      font-size: $text-xs;
      color: $ink-muted;
      white-space: nowrap;
    }
  }
}
</style>
