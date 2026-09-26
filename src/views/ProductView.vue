<script setup lang="ts">
import { computed } from 'vue'
import { useProductDetail } from '@/composables/useProductDetail'
import { useSettings } from '@/composables/useSettings'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductBuyBox from '@/components/product/ProductBuyBox.vue'
import ProductDetails from '@/components/product/ProductDetails.vue'
import ProductRail from '@/components/product/ProductRail.vue'
import ProductStickyBar from '@/components/product/ProductStickyBar.vue'

const { product, related, loading, notFound, category, discount } = useProductDetail()
const { settings } = useSettings()

const badge = computed(() => {
  if (!product.value) return ''
  if (product.value.stock <= 0) return 'Agotado'
  return discount.value ? `-${discount.value}%` : ''
})
</script>

<template>
  <div class="pdp">
    <div v-if="loading" class="pdp__main pdp__main--loading" aria-busy="true">
      <div class="pdp__ghost pdp__ghost--img"></div>
      <div class="pdp__ghost-col">
        <span class="pdp__ghost pdp__ghost--line"></span>
        <span class="pdp__ghost pdp__ghost--title"></span>
        <span class="pdp__ghost pdp__ghost--line"></span>
      </div>
    </div>

    <section v-else-if="notFound || !product" class="pdp__missing">
      <p class="pdp__eyebrow">Producto no encontrado</p>
      <h1 class="pdp__missing-title">Este producto ya <em>voló</em></h1>
      <p class="pdp__missing-text">
        Puede que se haya agotado o que el enlace esté mal escrito. Mira lo que tenemos hoy.
      </p>
      <RouterLink to="/tienda" class="btn btn--primary">Ver la tienda</RouterLink>
    </section>

    <template v-else>
      <nav class="pdp__crumbs" aria-label="Ruta">
        <RouterLink to="/tienda">Tienda</RouterLink>
        <template v-if="category">
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
          <RouterLink :to="`/tienda?categoria=${category.slug}`">{{ category.name }}</RouterLink>
        </template>
      </nav>

      <div class="pdp__main">
        <ProductGallery
          class="pdp__gallery"
          :images="product.images"
          :name="product.name"
          :badge="badge"
        />

        <div class="pdp__info">
          <RouterLink
            v-if="product.brand"
            :to="`/tienda?marca=${encodeURIComponent(product.brand)}`"
            class="pdp__brand"
          >
            {{ product.brand }}
          </RouterLink>
          <h1 class="pdp__name">{{ product.name }}</h1>
          <ProductBuyBox :product="product" :discount="discount" />
          <ProductDetails :description="product.description" :shipping="settings.shippingOptions" />
        </div>
      </div>

      <section v-if="related.length" class="pdp__related">
        <p class="pdp__eyebrow">Para completar tu look</p>
        <h2 class="pdp__related-title">También te va a <em>encantar</em></h2>
        <ProductRail :products="related" label="Productos relacionados" />
      </section>

      <ProductStickyBar :product="product" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.pdp {
  @include container(1180px);
  padding-block: $space-md calc(#{$space-xl} + 4.5rem);

  @include from('md') {
    padding-bottom: $space-xl;
  }

  &__crumbs {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-size: $text-xs;
    color: $ink-muted;
    margin-bottom: 1rem;

    a:hover {
      color: $accent-deep;
    }

    i {
      font-size: 0.55rem;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1.5rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3rem;
    }
  }

  &__gallery {
    @include from('md') {
      flex: 1 1 52%;
      position: sticky;
      top: 6.5rem;
    }
  }

  &__info {
    @include flex(column, stretch, flex-start, 0.9rem);
    min-width: 0;

    @include from('md') {
      flex: 1 1 44%;
      padding-top: 0.5rem;
    }
  }

  &__brand {
    @include eyebrow;
    align-self: flex-start;

    &:hover {
      color: $accent;
    }
  }

  &__name {
    @include display($display-sm);
    overflow-wrap: anywhere;
  }

  &__related {
    margin-top: $space-xl;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__related-title,
  &__missing-title {
    @include display($display-sm);
    margin: 0.3rem 0 1.25rem;

    em {
      color: $accent;
    }
  }

  &__missing {
    @include flex(column, center, center, 0.5rem);
    text-align: center;
    padding-block: $space-xl;
  }

  &__missing-title {
    font-size: $display-md;
    margin-bottom: 0.2rem;
  }

  &__missing-text {
    color: $ink-soft;
    max-width: 44ch;
    margin-bottom: 0.8rem;
  }

  &__ghost {
    display: block;
    background: $sand;
    border-radius: $radius-md;
    animation: ghost 1.6s ease-in-out infinite;

    &--img {
      aspect-ratio: 1;
      border-radius: $radius-lg;

      @include from('md') {
        flex: 1 1 52%;
      }
    }

    &--line {
      height: 0.9rem;
      width: 40%;
    }

    &--title {
      height: 2.4rem;
      width: 85%;
    }

    @include reduced-motion {
      animation: none;
    }
  }

  &__ghost-col {
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('md') {
      flex: 1 1 44%;
    }
  }
}

@keyframes ghost {
  50% {
    opacity: 0.5;
  }
}
</style>
