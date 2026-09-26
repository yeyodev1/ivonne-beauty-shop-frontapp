<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney, productCover } from '@/utils/format'
import { useProductCart } from '@/composables/useProductCart'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()

const { addToBag } = useProductCart()

const soldOut = computed(() => props.product.stock <= 0)
const discount = computed(() => {
  const { price, compareAtPrice } = props.product
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round((1 - price / compareAtPrice) * 100)
})
const link = computed(() => `/producto/${props.product.slug}`)
</script>

<template>
  <article class="card" :class="{ 'card--out': soldOut }">
    <RouterLink :to="link" class="card__media" :aria-label="product.name" tabindex="-1">
      <img
        :src="productCover(product.images)"
        :alt="product.name"
        loading="lazy"
        class="card__img"
      />
      <span v-if="soldOut" class="card__badge card__badge--out">Agotado</span>
      <span v-else-if="discount" class="card__badge">-{{ discount }}%</span>
    </RouterLink>

    <div class="card__body">
      <p v-if="product.brand" class="card__brand">{{ product.brand }}</p>
      <RouterLink :to="link" class="card__name">{{ product.name }}</RouterLink>
      <div class="card__foot">
        <p class="card__price">
          <span class="card__now">{{ formatMoney(product.price) }}</span>
          <s v-if="discount" class="card__before">{{ formatMoney(product.compareAtPrice || 0) }}</s>
        </p>
        <button
          type="button"
          class="card__add"
          :disabled="soldOut"
          :aria-label="soldOut ? `${product.name} agotado` : `Agregar ${product.name} a la bolsa`"
          @click="addToBag(product)"
        >
          <i class="fa-solid fa-bag-shopping"></i>
          <span class="card__add-label">Agregar</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  @include flex(column, stretch, flex-start);
  background: $surface;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $line;
  @include transition(box-shadow);

  &:hover {
    box-shadow: $shadow-md;

    .card__img {
      transform: scale(1.04);
    }
  }

  &__media {
    position: relative;
    display: block;
    aspect-ratio: 1;
    background: $sand;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s $ease;

    @include reduced-motion {
      transition: none;
    }
  }

  &--out &__img {
    opacity: 0.55;
    filter: grayscale(0.4);
  }

  &__badge {
    position: absolute;
    top: 0.55rem;
    left: 0.55rem;
    background: $accent;
    color: $surface;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 0.25rem 0.6rem;
    border-radius: $radius-pill;

    &--out {
      background: $ink;
      text-transform: uppercase;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.3rem);
    flex: 1;
    padding: 0.75rem 0.75rem 0.8rem;

    @include from('md') {
      padding: 0.95rem 1rem 1rem;
    }
  }

  &__brand {
    @include eyebrow;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 500;
    line-height: 1.35;
    color: $ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.7em;

    &:hover {
      color: $accent-deep;
    }
  }

  &__foot {
    @include flex(row, flex-end, space-between, 0.4rem);
    margin-top: auto;
    padding-top: 0.35rem;
  }

  &__price {
    @include flex(column, flex-start, flex-end, 0);
    line-height: 1.2;
    min-width: 0;
  }

  &__now {
    font-family: $font-display;
    font-size: 1.08rem;
    font-weight: 600;
    color: $ink;
  }

  &__before {
    font-size: 0.72rem;
    color: $ink-muted;
  }

  &__add {
    @include flex(row, center, center, 0.4rem);
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: $radius-pill;
    background: $blush;
    color: $accent-deep;
    font-size: 0.78rem;
    font-weight: 600;
    @include transition;
    @include focus-ring;

    &:hover:not(:disabled) {
      background: $accent;
      color: $surface;
    }

    &:disabled {
      background: $sand;
      color: $ink-muted;
      cursor: not-allowed;
    }

    @include from('lg') {
      width: auto;
      padding-inline: 1rem;
    }
  }

  &__add-label {
    display: none;

    @include from('lg') {
      display: inline;
    }
  }
}
</style>
