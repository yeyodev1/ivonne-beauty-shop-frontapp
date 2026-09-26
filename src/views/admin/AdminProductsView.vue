<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AdminSearch from '@/components/admin/AdminSearch.vue'
import AdminFilterChips from '@/components/admin/AdminFilterChips.vue'
import AdminProductRow from '@/components/admin/AdminProductRow.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import { PRODUCT_STATUS_OPTIONS, useAdminProducts } from '@/composables/useAdminProducts'
import { useAdminCategories } from '@/composables/useAdminCategories'

const { items, total, pages, page, q, filters, loading, busyId, toggle } = useAdminProducts()
const { categories, load: loadCategories } = useAdminCategories()

const hasFilters = computed(() => Boolean(q.value || filters.status || filters.category))

onMounted(() => loadCategories())
</script>

<template>
  <section class="products">
    <div class="products__tools">
      <AdminSearch v-model="q" placeholder="Buscar por nombre o marca" label="Buscar productos" />
      <div class="products__filters">
        <AdminFilterChips v-model="filters.status" :options="PRODUCT_STATUS_OPTIONS" label="Filtrar por estado" />
        <label class="visually-hidden" for="product-category">Categoría</label>
        <select id="product-category" v-model="filters.category" class="products__select">
          <option value="">Todas las categorías</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <p v-if="!loading" class="products__count">{{ total }} {{ total === 1 ? 'producto' : 'productos' }}</p>
    </div>

    <AdminSkeleton v-if="loading" :rows="6" />

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-bag-shopping"
      :title="hasFilters ? 'Nada coincide con tu búsqueda' : 'Todavía no hay productos'"
      :text="hasFilters ? 'Prueba con otra palabra o quita los filtros.' : 'Crea el primero y súbele fotos desde tu celular.'"
    >
      <RouterLink v-if="!hasFilters" :to="{ name: 'AdminProductNew' }" class="btn btn--primary">
        Crear producto
      </RouterLink>
    </AdminEmpty>

    <div v-else class="products__list">
      <AdminProductRow
        v-for="product in items"
        :key="product._id"
        :product="product"
        :busy="busyId === product._id"
        @toggle-publish="toggle(product, 'isPublished')"
        @toggle-featured="toggle(product, 'isFeatured')"
      />
    </div>

    <AdminPagination v-model="page" :pages="pages" :total="total" />

    <RouterLink :to="{ name: 'AdminProductNew' }" class="products__fab" aria-label="Nuevo producto">
      <i class="fa-solid fa-plus"></i>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.products {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__tools {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__filters {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__select {
    min-height: 44px;
    font-size: 1rem;

    @include from('lg') {
      max-width: 260px;
    }
  }

  &__count {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.5rem);

    @include from('lg') {
      @include flex-cards(420px, 0.6rem);
      flex-direction: row;

      // Dos columnas fijas: la última tarjeta no se estira a todo el ancho
      > * {
        flex: 0 0 calc((100% - 0.6rem) / 2);
      }
    }
  }

  &__fab {
    position: fixed;
    right: 1rem;
    bottom: calc(76px + env(safe-area-inset-bottom));
    z-index: 95;
    @include flex(row, center, center);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-size: 1.3rem;
    box-shadow: 0 10px 24px rgba($accent, 0.35);
    @include transition(transform);
    @include focus-ring;

    &:active {
      transform: scale(0.94);
    }

    @include from('lg') {
      bottom: 2rem;
      right: 2rem;
    }
  }
}
</style>
