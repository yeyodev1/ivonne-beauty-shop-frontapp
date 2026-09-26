<script setup lang="ts">
defineProps<{ brands: string[] }>()
</script>

<template>
  <section v-if="brands.length" class="brands" aria-labelledby="brands-title">
    <h2 id="brands-title" class="brands__label">Marcas que amamos</h2>
    <div class="brands__track">
      <RouterLink
        v-for="brand in brands"
        :key="brand"
        :to="`/tienda?marca=${encodeURIComponent(brand)}`"
        class="brands__item"
      >
        {{ brand }}
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.brands {
  margin-top: $space-xl;
  background: $ink;
  color: $paper;
  padding-block: 1.6rem 1.4rem;

  &__label {
    @include container(1180px);
    @include eyebrow;
    color: $blush;
    margin-bottom: 0.5rem;
  }

  &__track {
    @include flex(row, center, flex-start, 0.4rem);
    overflow-x: auto;
    scrollbar-width: none;
    padding-inline: 1.25rem;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      padding-inline: max(2rem, calc((100vw - 1180px) / 2 + 2rem));
    }
  }

  &__item {
    @include flex(row, center, center);
    flex-shrink: 0;
    min-height: 48px;
    padding-inline: 0.9rem;
    font-family: $font-display;
    font-size: clamp(1.3rem, 1.1rem + 1vw, 1.9rem);
    font-style: italic;
    white-space: nowrap;
    color: rgba($paper, 0.9);
    @include transition(color);
    @include focus-ring($blush);

    // Separador: un punto fucsia entre marca y marca
    & + &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $accent;
      margin-right: 1.3rem;
      flex-shrink: 0;
    }

    &:hover {
      color: $blush;
    }
  }
}
</style>
