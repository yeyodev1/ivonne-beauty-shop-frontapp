<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { formatMoney } from '@/utils/format'
import { useProductCart } from '@/composables/useProductCart'
import type { Product, ProductShade } from '@/types'

const props = defineProps<{ product: Product; shade: ProductShade | null }>()
const { addToBag } = useProductCart()

const needsShade = computed(() => props.product.shades?.length > 0 && !props.shade)
const stock = computed(() => (props.shade ? props.shade.stock : props.product.stock))

function add() {
  // En móvil el selector puede estar fuera de vista: se lleva ahí en vez de mostrar un error.
  if (needsShade.value) {
    document.getElementById('tonos')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  addToBag(props.product, 1, true, props.shade)
}
</script>

<template>
  <div class="sticky">
    <div class="sticky__info">
      <span class="sticky__name">
        {{ product.name }}<template v-if="shade"> · {{ shade.name }}</template>
      </span>
      <strong class="sticky__price">{{ formatMoney(product.price) }}</strong>
    </div>
    <button
      type="button"
      class="btn btn--primary sticky__btn"
      :disabled="stock <= 0"
      @click="add"
    >
      <template v-if="needsShade && stock > 0">{{ site.shades.choose }}</template>
      <template v-else-if="stock > 0"><i class="fa-solid fa-bag-shopping"></i> Agregar</template>
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
