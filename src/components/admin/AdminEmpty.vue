<script setup lang="ts">
defineProps<{ icon?: string; title: string; text?: string }>()
</script>

<template>
  <div class="empty">
    <span class="empty__icon"><i :class="icon || 'fa-solid fa-box-open'" aria-hidden="true"></i></span>
    <p class="empty__title">{{ title }}</p>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include card;
  @include flex(column, center, center, 0.5rem);
  text-align: center;
  padding: 2.4rem 1.2rem;
  border-style: dashed;

  &__icon {
    @include flex(row, center, center);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: $sand;
    color: $accent;
    font-size: 1.3rem;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-lg;
    color: $ink;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 32ch;
  }
}
</style>
