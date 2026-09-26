<script setup lang="ts">
import ProductCard from '@/components/catalog/ProductCard.vue'
import ProductCardSkeleton from '@/components/catalog/ProductCardSkeleton.vue'
import type { Product } from '@/types'

defineProps<{ products: Product[]; loading?: boolean; label: string }>()
</script>

<template>
  <div class="rail" role="region" :aria-label="label" tabindex="0">
    <template v-if="loading">
      <ProductCardSkeleton v-for="n in 4" :key="n" class="rail__item" />
    </template>
    <ProductCard
      v-for="product in products"
      v-else
      :key="product._id"
      :product="product"
      class="rail__item"
    />
  </div>
</template>

<style scoped lang="scss">
// Carrusel horizontal: scroll nativo con snap, sin librerías.
.rail {
  @include flex(row, stretch, flex-start, 0.75rem);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 1.25rem;
  padding: 0.25rem 1.25rem 1rem;
  margin-inline: -1.25rem;
  scrollbar-width: thin;
  scrollbar-color: $blush transparent;

  @include from('md') {
    gap: 1.25rem;
    margin-inline: -2rem;
    padding-inline: 2rem;
    scroll-padding-inline: 2rem;
  }

  &__item {
    flex: 0 0 min(46%, 220px);
    scroll-snap-align: start;

    @include from('md') {
      flex-basis: 240px;
    }
  }
}
</style>
