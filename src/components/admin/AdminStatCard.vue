<script setup lang="ts">
defineProps<{ label: string; value: string | number; icon: string; hint?: string; alert?: boolean; to?: object }>()
</script>

<template>
  <component :is="to ? 'RouterLink' : 'div'" :to="to" class="stat" :class="{ 'stat--alert': alert }">
    <span class="stat__icon"><i :class="icon" aria-hidden="true"></i></span>
    <span class="stat__value">{{ value }}</span>
    <span class="stat__label">{{ label }}</span>
    <span v-if="hint" class="stat__hint">{{ hint }}</span>
  </component>
</template>

<style scoped lang="scss">
.stat {
  @include card;
  @include flex(column, flex-start, flex-start, 0.15rem);
  padding: 0.95rem 0.9rem;
  min-width: 0;
  @include focus-ring;

  &__icon {
    @include flex(row, center, center);
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: $sand;
    color: $accent;
    font-size: 0.9rem;
    margin-bottom: 0.45rem;
  }

  &__value {
    font-size: clamp(1rem, 4.6vw, 1.45rem);
    font-weight: 700;
    color: $ink;
    line-height: 1.15;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: $ink-soft;
    line-height: 1.3;
  }

  &__hint {
    font-size: 0.68rem;
    color: $ink-muted;
  }

  &--alert &__icon {
    background: $warning-bg;
    color: #b0822a;
  }
}
</style>
