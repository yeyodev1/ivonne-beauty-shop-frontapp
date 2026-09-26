<script setup lang="ts">
defineProps<{
  tone: 'loading' | 'success' | 'warning' | 'error'
  title: string
  text?: string
}>()

const ICONS = {
  loading: 'fa-solid fa-spinner fa-spin',
  success: 'fa-solid fa-check',
  warning: 'fa-solid fa-rotate-left',
  error: 'fa-solid fa-triangle-exclamation',
}
</script>

<template>
  <div class="status" :class="`status--${tone}`" :role="tone === 'loading' ? 'status' : undefined" aria-live="polite">
    <span class="status__icon" aria-hidden="true"><i :class="ICONS[tone]"></i></span>
    <h1 class="status__title">{{ title }}</h1>
    <p v-if="text" class="status__text">{{ text }}</p>
    <div v-if="$slots.default" class="status__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.status {
  @include flex(column, center, flex-start, 0.8rem);
  text-align: center;

  &__icon {
    @include flex(row, center, center);
    width: 76px;
    height: 76px;
    border-radius: 50%;
    font-size: 1.9rem;
    margin-bottom: 0.4rem;
  }

  &--loading &__icon {
    background: $sand;
    color: $accent;
  }

  &--success &__icon {
    background: $accent;
    color: $surface;
    box-shadow: 0 0 0 10px $accent-soft;
  }

  &--warning &__icon {
    background: $warning-bg;
    color: $warning;
  }

  &--error &__icon {
    background: $danger-bg;
    color: $danger;
  }

  &__title {
    @include display($display-sm, 500);
  }

  &__text {
    max-width: 44ch;
    color: $ink-soft;
    font-size: $text-base;
  }

  &__actions {
    @include flex(column, stretch, center, 0.7rem);
    width: 100%;
    max-width: 360px;
    margin-top: 0.8rem;

    :slotted(.btn) {
      min-height: 48px;
    }
  }
}
</style>
