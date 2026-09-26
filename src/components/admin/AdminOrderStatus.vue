<script setup lang="ts">
import { computed } from 'vue'
import AdminChip, { type ChipTone } from './AdminChip.vue'
import { ORDER_STATUS_LABELS } from '@/utils/format'
import type { OrderStatus } from '@/types'

const props = defineProps<{ status: OrderStatus }>()

const TONES: Record<OrderStatus, ChipTone> = {
  pending: 'warning',
  paid: 'success',
  preparing: 'accent',
  shipped: 'info',
  delivered: 'success',
  canceled: 'danger',
}

const ICONS: Record<OrderStatus, string> = {
  pending: 'fa-solid fa-hourglass-half',
  paid: 'fa-solid fa-circle-check',
  preparing: 'fa-solid fa-box-open',
  shipped: 'fa-solid fa-truck-fast',
  delivered: 'fa-solid fa-house-circle-check',
  canceled: 'fa-solid fa-ban',
}

const tone = computed(() => TONES[props.status] || 'neutral')
</script>

<template>
  <AdminChip :tone="tone" :icon="ICONS[status]">
    {{ ORDER_STATUS_LABELS[status] || status }}
  </AdminChip>
</template>
