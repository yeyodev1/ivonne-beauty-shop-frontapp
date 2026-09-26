<script setup lang="ts">
defineProps<{ title: string; icon?: string; hint?: string }>()
</script>

<template>
  <section class="fsec">
    <header class="fsec__head">
      <h2 class="fsec__title">
        <i v-if="icon" :class="icon" aria-hidden="true"></i>
        {{ title }}
      </h2>
      <p v-if="hint" class="fsec__hint">{{ hint }}</p>
    </header>
    <div class="fsec__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.fsec {
  @include card;
  padding: 1rem;

  @include from('md') {
    padding: 1.4rem;
  }

  &__head {
    margin-bottom: 0.9rem;
  }

  &__title {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-principal;
    font-size: 0.95rem;
    font-weight: 700;

    i {
      color: $accent;
      font-size: 0.85rem;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.2rem;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.9rem);

    // Inputs a 16px en móvil: por debajo iOS hace zoom al enfocar
    :deep(input:not([type='checkbox'])),
    :deep(select),
    :deep(textarea) {
      font-size: 1rem;
      min-height: 46px;
    }
  }
}
</style>
