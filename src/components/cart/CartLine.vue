<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { formatMoney } from '@/utils/format'
import QuantityStepper from './QuantityStepper.vue'
import type { CartItem } from '@/types'

const props = defineProps<{ item: CartItem }>()
const emit = defineEmits<{ navigate: [] }>()

const cart = useCartStore()

const quantity = computed({
  get: () => props.item.quantity,
  set: (value: number) => cart.setQuantity(props.item.productId, value),
})
const max = computed(() => Math.max(1, Math.min(props.item.stock, 20)))
const link = computed(() => `/producto/${props.item.slug}`)
</script>

<template>
  <li class="line">
    <RouterLink :to="link" class="line__media" tabindex="-1" @click="emit('navigate')">
      <img :src="item.image || '/placeholder-product.svg'" :alt="item.name" loading="lazy" />
    </RouterLink>
    <div class="line__info">
      <p v-if="item.brand" class="line__brand">{{ item.brand }}</p>
      <RouterLink :to="link" class="line__name" @click="emit('navigate')">{{ item.name }}</RouterLink>
      <p class="line__unit">{{ formatMoney(item.price) }} c/u</p>
      <div class="line__row">
        <QuantityStepper v-model="quantity" :max="max" size="sm" :label="`Cantidad de ${item.name}`" />
        <strong class="line__total">{{ formatMoney(item.price * item.quantity) }}</strong>
      </div>
      <p v-if="item.quantity >= item.stock" class="line__hint">Es todo lo que tenemos disponible</p>
    </div>
    <button
      type="button"
      class="line__remove"
      :aria-label="`Quitar ${item.name} de la bolsa`"
      @click="cart.remove(item.productId)"
    >
      <i class="fa-regular fa-trash-can"></i>
    </button>
  </li>
</template>

<style scoped lang="scss">
.line {
  @include flex(row, flex-start, flex-start, 0.85rem);
  position: relative;
  padding-block: 1rem;
  border-bottom: 1px solid $line;

  &__media {
    flex: 0 0 76px;
    height: 76px;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    @include flex(column, stretch, flex-start, 0.15rem);
    flex: 1;
    min-width: 0;
    padding-right: 2rem;
  }

  &__brand {
    @include eyebrow;
    font-size: 0.6rem;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 500;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &:hover {
      color: $accent-deep;
    }
  }

  &__unit {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__row {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }

  &__total {
    font-family: $font-display;
    font-weight: 600;
    font-size: 1.02rem;
  }

  &__hint {
    font-size: 0.7rem;
    color: $accent-deep;
    margin-top: 0.2rem;
  }

  &__remove {
    position: absolute;
    top: 0.6rem;
    right: -0.5rem;
    width: 44px;
    height: 44px;
    color: $ink-muted;
    font-size: 0.9rem;
    @include focus-ring;

    &:hover {
      color: $danger;
    }
  }
}
</style>
