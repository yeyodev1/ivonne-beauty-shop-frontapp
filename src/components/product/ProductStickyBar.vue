<script setup lang="ts">
import { formatMoney } from '@/utils/format'
import { useProductCart } from '@/composables/useProductCart'
import type { Product } from '@/types'

defineProps<{ product: Product }>()
const { addToBag } = useProductCart()
</script>

<template>
  <div class="sticky">
    <div class="sticky__info">
      <span class="sticky__name">{{ product.name }}</span>
      <strong class="sticky__price">{{ formatMoney(product.price) }}</strong>
    </div>
    <button
      type="button"
      class="btn btn--primary sticky__btn"
      :disabled="product.stock <= 0"
      @click="addToBag(product)"
    >
      <template v-if="product.stock > 0"><i class="fa-solid fa-bag-shopping"></i> Agregar</template>
      <template v-else>Agotado</template>
    </button>
  </div>
</template>

<style scoped lang="scss">
.sticky {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  @include flex(row, center, space-between, 0.8rem);
  padding: 0.7rem 1.25rem calc(0.7rem + env(safe-area-inset-bottom));
  background: rgba($surface, 0.96);
  backdrop-filter: blur(10px);
  border-top: 1px solid $line;
  box-shadow: 0 -10px 30px rgba($ink, 0.06);

  @include from('md') {
    display: none;
  }

  &__info {
    @include flex(column, flex-start, center);
    min-width: 0;
  }

  &__name {
    font-size: $text-xs;
    color: $ink-soft;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  &__price {
    font-family: $font-display;
    font-size: $text-lg;
    line-height: 1.1;
  }

  &__btn {
    flex-shrink: 0;
    min-height: 48px;
    padding-inline: 1.4rem;
  }
}
</style>
