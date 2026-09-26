<script setup lang="ts">
export type ChipTone = 'success' | 'warning' | 'info' | 'danger' | 'accent' | 'neutral'

defineProps<{ tone?: ChipTone; icon?: string }>()
</script>

<template>
  <span class="chip" :class="`chip--${tone || 'neutral'}`">
    <i v-if="icon" :class="icon" aria-hidden="true"></i>
    <slot />
  </span>
</template>

<style scoped lang="scss">
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: $font-principal;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
  padding: 0.38rem 0.6rem;
  border-radius: $radius-pill;
  white-space: nowrap;

  &--success {
    color: #2a8a5d;
    background: $success-bg;
  }

  &--warning {
    color: #8f6a1f;
    background: $warning-bg;
  }

  &--info {
    color: #4f6f91;
    background: $info-bg;
  }

  &--danger {
    color: $danger;
    background: $danger-bg;
  }

  &--accent {
    color: $accent-deep;
    background: $accent-soft;
  }

  &--neutral {
    color: $ink-soft;
    background: $sand;
  }
}
</style>
