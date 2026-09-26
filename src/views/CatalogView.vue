<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCatalog } from '@/composables/useCatalog'
import CategoryChips from '@/components/catalog/CategoryChips.vue'
import CatalogToolbar from '@/components/catalog/CatalogToolbar.vue'
import BrandFilter from '@/components/catalog/BrandFilter.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'
import CatalogPagination from '@/components/catalog/CatalogPagination.vue'
import CatalogEmpty from '@/components/catalog/CatalogEmpty.vue'

const {
  products,
  total,
  pages,
  page,
  loading,
  query,
  categories,
  brands,
  activeCategory,
  hasFilters,
  setFilters,
  clearFilters,
} = useCatalog()

const filtersOpen = ref(false)

const title = computed(() => {
  if (query.value.q) return `Resultados para «${query.value.q}»`
  if (activeCategory.value) return activeCategory.value.name
  if (query.value.brand) return query.value.brand
  return 'Toda la tienda'
})

const countLabel = computed(() =>
  total.value === 1 ? '1 producto' : `${total.value} productos`,
)

function goToPage(next: number) {
  setFilters({ pagina: next })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="catalog">
    <header class="catalog__head">
      <p class="catalog__eyebrow">Tienda</p>
      <h1 class="catalog__title">{{ title }}</h1>
      <p v-if="activeCategory?.description" class="catalog__lead">
        {{ activeCategory.description }}
      </p>
    </header>

    <div class="catalog__bar">
      <CategoryChips
        :categories="categories"
        :active="query.category"
        @select="(slug) => setFilters({ categoria: slug })"
      />
      <CatalogToolbar
        :q="query.q"
        :sort="query.sort"
        :brand="query.brand"
        @search="(q) => setFilters({ q })"
        @sort="(orden) => setFilters({ orden })"
        @filters="filtersOpen = true"
      />
    </div>

    <div class="catalog__body">
      <BrandFilter
        :brands="brands"
        :active="query.brand"
        :open="filtersOpen"
        class="catalog__side"
        @select="(marca) => setFilters({ marca })"
        @close="filtersOpen = false"
      />

      <section class="catalog__results" aria-live="polite">
        <div v-if="!loading && (hasFilters || total)" class="catalog__meta">
          <span>{{ countLabel }}</span>
          <button
            v-if="query.brand"
            type="button"
            class="catalog__tag"
            :aria-label="`Quitar marca ${query.brand}`"
            @click="setFilters({ marca: undefined })"
          >
            {{ query.brand }} <i class="fa-solid fa-xmark"></i>
          </button>
          <button
            v-if="query.q"
            type="button"
            class="catalog__tag"
            :aria-label="`Quitar búsqueda ${query.q}`"
            @click="setFilters({ q: undefined })"
          >
            «{{ query.q }}» <i class="fa-solid fa-xmark"></i>
          </button>
          <button v-if="hasFilters" type="button" class="catalog__clear" @click="clearFilters">
            Limpiar todo
          </button>
        </div>

        <CatalogEmpty
          v-if="!loading && !products.length"
          :search="query.q"
          :filtered="hasFilters"
          @clear="clearFilters"
        />
        <template v-else>
          <ProductGrid :products="products" :loading="loading" :skeletons="8" />
          <CatalogPagination :page="page" :pages="pages" @go="goToPage" />
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  @include container(1240px);
  padding-block: $space-md $space-xl;

  &__head {
    @include flex(column, flex-start, flex-start, 0.35rem);
    padding-block: 0.5rem 1.25rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
    overflow-wrap: anywhere;
  }

  &__lead {
    color: $ink-soft;
    max-width: 60ch;
    font-size: $text-sm;
  }

  &__bar {
    @include flex(column, stretch, flex-start, 0.8rem);
    padding-bottom: 1.25rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid $line;
  }

  &__body {
    @include flex(column, stretch, flex-start, 1.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 2.25rem;
    }
  }

  &__side {
    @include from('lg') {
      flex: 0 0 210px;
    }
  }

  &__results {
    flex: 1;
    min-width: 0;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-muted;
    margin-bottom: 1rem;
  }

  &__tag {
    @include flex(row, center, center, 0.4rem);
    min-height: 34px;
    padding: 0 0.8rem;
    border-radius: $radius-pill;
    background: $blush;
    color: $accent-deep;
    font-size: $text-xs;
    font-weight: 600;
    @include focus-ring;
  }

  &__clear {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
    min-height: 34px;
    padding-inline: 0.3rem;
  }
}
</style>
