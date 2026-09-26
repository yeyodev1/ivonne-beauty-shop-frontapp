<script setup lang="ts">
import { ORDER_STATUS_LABELS } from '@/utils/format'
import type { OrderStatus } from '@/types'

defineProps<{ status: OrderStatus }>()
</script>

<template>
  <span class="chip" :class="`chip--${status}`">{{ ORDER_STATUS_LABELS[status] || status }}</span>
</template>

<style scoped lang="scss">
.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 600;
  white-space: nowrap;

  &--pending {
    background: $warning-bg;
    color: darken($warning, 18%);
  }

  &--paid {
    background: $accent-soft;
    color: $accent-deep;
  }

  &--preparing {
    background: $info-bg;
    color: darken($info, 12%);
  }

  &--shipped {
    background: $blush;
    color: $ink;
  }

  &--delivered {
    background: $success-bg;
    color: darken($success, 14%);
  }

  &--canceled {
    background: $danger-bg;
    color: $danger;
  }
}
</style>
