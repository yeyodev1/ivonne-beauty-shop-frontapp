<script setup lang="ts">
defineProps<{ title: string; icon: string }>()
</script>

<template>
  <section class="panel">
    <h2 class="panel__title">
      <i :class="icon" aria-hidden="true"></i>
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.panel {
  @include card;
  padding: 1.2rem 1rem;

  @include from('md') {
    padding: 1.5rem;
  }

  &__title {
    @include flex(row, center, flex-start, 0.6rem);
    font-size: $text-lg;
    font-weight: 600;
    margin-bottom: 1rem;

    i {
      color: $accent;
      font-size: 1rem;
    }
  }

  :deep(form) {
    @include flex(column, stretch, flex-start, 1rem);
  }

  :deep(input) {
    min-height: 48px;
    font-size: 1rem;
  }

  :deep(.btn) {
    min-height: 48px;

    @include until('sm') {
      width: 100%;
    }
  }
}
</style>
