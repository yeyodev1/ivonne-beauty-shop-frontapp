<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import ProductCardSkeleton from './ProductCardSkeleton.vue'
import type { Product } from '@/types'

withDefaults(defineProps<{ products: Product[]; loading?: boolean; skeletons?: number }>(), {
  loading: false,
  skeletons: 8,
})
</script>

<template>
  <div class="grid" :aria-busy="loading">
    <template v-if="loading">
      <ProductCardSkeleton v-for="n in skeletons" :key="n" />
    </template>
    <template v-else>
      <ProductCard v-for="product in products" :key="product._id" :product="product" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.grid {
  @include flex-cards(150px, 0.75rem);

  // 2 columnas en móvil, 3 en md, 4 en lg. El max-width evita que la
  // última fila se estire a lo ancho.
  > * {
    flex-basis: calc(50% - 0.375rem);
    max-width: calc(50% - 0.375rem);
  }

  @include from('md') {
    gap: 1.25rem;

    > * {
      flex-basis: calc((100% - 2.5rem) / 3);
      max-width: calc((100% - 2.5rem) / 3);
    }
  }

  @include from('lg') {
    > * {
      flex-basis: calc((100% - 3.75rem) / 4);
      max-width: calc((100% - 3.75rem) / 4);
    }
  }
}
</style>
