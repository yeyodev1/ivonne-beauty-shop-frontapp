<script setup lang="ts">
import { computed } from 'vue'
import AdminChip from './AdminChip.vue'
import { formatMoney, productCover } from '@/utils/format'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; busy?: boolean }>()
const emit = defineEmits<{ togglePublish: []; toggleFeatured: [] }>()

const stockTone = computed(() => {
  if (props.product.stock <= 0) return 'danger'
  if (props.product.stock <= 3) return 'warning'
  return 'neutral'
})
</script>

<template>
  <article class="row" :class="{ 'row--draft': !product.isPublished }">
    <RouterLink
      :to="{ name: 'AdminProductEdit', params: { id: product._id } }"
      class="row__main"
      :aria-label="`Editar ${product.name}`"
    >
      <img class="row__img" :src="productCover(product.images)" :alt="product.name" loading="lazy" />
      <div class="row__info">
        <p class="row__brand">{{ product.brand || 'Sin marca' }}</p>
        <p class="row__name">{{ product.name }}</p>
        <div class="row__meta">
          <strong class="row__price">{{ formatMoney(product.price) }}</strong>
          <AdminChip :tone="stockTone">
            {{ product.stock > 0 ? `${product.stock} en stock` : 'Agotado' }}
          </AdminChip>
          <AdminChip :tone="product.isPublished ? 'success' : 'neutral'">
            {{ product.isPublished ? 'Publicado' : 'Borrador' }}
          </AdminChip>
        </div>
      </div>
    </RouterLink>
    <div class="row__actions">
      <button
        type="button"
        class="row__toggle"
        :class="{ 'row__toggle--on': product.isPublished }"
        :disabled="busy"
        :aria-label="product.isPublished ? 'Ocultar de la tienda' : 'Publicar en la tienda'"
        :aria-pressed="product.isPublished"
        @click="emit('togglePublish')"
      >
        <i :class="product.isPublished ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
      </button>
      <button
        type="button"
        class="row__toggle"
        :class="{ 'row__toggle--star': product.isFeatured }"
        :disabled="busy"
        :aria-label="product.isFeatured ? 'Quitar de destacados' : 'Destacar'"
        :aria-pressed="product.isFeatured"
        @click="emit('toggleFeatured')"
      >
        <i :class="product.isFeatured ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.row {
  @include card;
  @include flex(row, center, flex-start, 0.3rem);
  padding: 0.55rem 0.4rem 0.55rem 0.55rem;

  &--draft &__img {
    opacity: 0.6;
  }

  &__main {
    flex: 1 1 auto;
    min-width: 0;
    @include flex(row, center, flex-start, 0.75rem);
    @include focus-ring;
  }

  &__img {
    flex: 0 0 64px;
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 10px;
    background: $sand;
  }

  &__info {
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.1rem);
  }

  &__brand {
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $ink-muted;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__name {
    font-size: 0.88rem;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
    margin-top: 0.25rem;
  }

  &__price {
    font-size: 0.88rem;
    font-variant-numeric: tabular-nums;
    margin-right: 0.15rem;
  }

  &__actions {
    flex: 0 0 auto;
    @include flex(column, center, center, 0.1rem);

    @include from('md') {
      flex-direction: row;
    }
  }

  &__toggle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $ink-muted;
    @include transition;
    @include focus-ring;

    &:hover {
      background: $sand;
    }

    &--on {
      color: $success;
    }

    &--star {
      color: $warning;
    }

    &:disabled {
      opacity: 0.4;
    }
  }
}
</style>
