<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminSearch from '@/components/admin/AdminSearch.vue'
import AdminFilterChips from '@/components/admin/AdminFilterChips.vue'
import AdminOrderCard from '@/components/admin/AdminOrderCard.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import { adminService } from '@/services/admin.service'
import { useAdminList } from '@/composables/useAdminList'
import { ORDER_STATUS_LABELS } from '@/utils/format'
import type { Order, OrderStatus } from '@/types'

const route = useRoute()

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
]

const { items, total, pages, page, q, filters, loading } = useAdminList<Order, { status: string }>(
  (query) => adminService.listOrders({ ...query, status: query.status as OrderStatus | '', limit: 20 }),
  { status: String(route.query.status || '') },
)

const hasFilters = computed(() => Boolean(q.value || filters.status))
</script>

<template>
  <section class="orders">
    <div class="orders__tools">
      <AdminSearch v-model="q" placeholder="Número, nombre o correo" label="Buscar pedidos" />
      <AdminFilterChips v-model="filters.status" :options="STATUS_OPTIONS" label="Filtrar por estado" />
      <p v-if="!loading" class="orders__count">{{ total }} {{ total === 1 ? 'pedido' : 'pedidos' }}</p>
    </div>

    <AdminSkeleton v-if="loading" :rows="6" height="96px" />

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-receipt"
      :title="hasFilters ? 'No hay pedidos con ese filtro' : 'Aún no hay pedidos'"
      :text="hasFilters ? 'Prueba con otro estado o búsqueda.' : 'Los pedidos de la web aparecerán aquí.'"
    />

    <div v-else class="orders__list">
      <AdminOrderCard v-for="order in items" :key="order._id" :order="order" />
    </div>

    <AdminPagination v-model="page" :pages="pages" :total="total" />
  </section>
</template>

<style scoped lang="scss">
.orders {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__tools {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__count {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.55rem);

    @include from('lg') {
      @include flex-cards(420px, 0.7rem);
      flex-direction: row;

      // Dos columnas fijas: la última tarjeta no se estira a todo el ancho
      > * {
        flex: 0 0 calc((100% - 0.7rem) / 2);
      }
    }
  }
}
</style>
