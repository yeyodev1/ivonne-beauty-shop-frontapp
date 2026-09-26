<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import AdminOrderCard from '@/components/admin/AdminOrderCard.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { formatMoney } from '@/utils/format'
import type { AdminStats, ApiError } from '@/types'

const toast = useToastStore()
const userStore = useUserStore()

const stats = ref<AdminStats | null>(null)
const loading = ref(true)

const firstName = (userStore.user?.name || '').split(' ')[0]

onMounted(async () => {
  try {
    stats.value = await adminService.stats()
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="dash">
    <header class="dash__hello">
      <p class="dash__eyebrow">Resumen de la tienda</p>
      <h2 class="dash__title">Hola bella<span v-if="firstName">, {{ firstName }}</span></h2>
    </header>

    <div class="dash__quick">
      <RouterLink :to="{ name: 'AdminProductNew' }" class="btn btn--primary">
        <i class="fa-solid fa-plus" aria-hidden="true"></i> Nuevo producto
      </RouterLink>
      <RouterLink :to="{ name: 'AdminOrders' }" class="btn btn--ghost">
        <i class="fa-solid fa-receipt" aria-hidden="true"></i> Ver pedidos
      </RouterLink>
    </div>

    <AdminSkeleton v-if="loading" :rows="3" height="104px" />

    <template v-else-if="stats">
      <div class="dash__stats">
        <AdminStatCard
          label="Ventas del mes"
          :value="formatMoney(stats.salesMonth)"
          icon="fa-solid fa-sack-dollar"
          :hint="`${stats.paidOrdersMonth} pedidos pagados`"
        />
        <AdminStatCard label="Pedidos hoy" :value="stats.ordersToday" icon="fa-solid fa-calendar-day" />
        <AdminStatCard
          label="Pendientes de pago"
          :value="stats.pendingOrders"
          icon="fa-solid fa-hourglass-half"
          :alert="stats.pendingOrders > 0"
          :to="{ name: 'AdminOrders', query: { status: 'pending' } }"
        />
        <AdminStatCard
          label="Productos publicados"
          :value="`${stats.publishedProducts}/${stats.products}`"
          icon="fa-solid fa-bag-shopping"
          :to="{ name: 'AdminProducts' }"
        />
        <AdminStatCard
          label="Bajo stock"
          :value="stats.lowStock"
          icon="fa-solid fa-triangle-exclamation"
          :alert="stats.lowStock > 0"
          :to="{ name: 'AdminProducts', query: { status: 'out' } }"
        />
        <AdminStatCard
          label="Clientes"
          :value="stats.customers"
          icon="fa-solid fa-user-group"
          :to="{ name: 'AdminCustomers' }"
        />
      </div>

      <div class="dash__section">
        <div class="dash__section-head">
          <h2 class="dash__subtitle">Últimos pedidos</h2>
          <RouterLink :to="{ name: 'AdminOrders' }" class="dash__more">Ver todos</RouterLink>
        </div>
        <div v-if="stats.recentOrders.length" class="dash__orders">
          <AdminOrderCard v-for="order in stats.recentOrders" :key="order._id" :order="order" />
        </div>
        <AdminEmpty
          v-else
          icon="fa-solid fa-receipt"
          title="Aún no hay pedidos"
          text="Cuando alguien compre en la web, lo verás aquí."
        />
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.dash {
  @include flex(column, stretch, flex-start, 1.2rem);

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 500);
    font-style: italic;
    margin-top: 0.3rem;
  }

  &__quick {
    @include flex(row, stretch, flex-start, 0.6rem);

    .btn {
      flex: 1 1 0;
      min-height: 46px;
      padding-inline: 0.6rem;
      font-size: 0.78rem;
      letter-spacing: 0;
      white-space: nowrap;

      @include from('md') {
        flex: 0 0 auto;
        padding-inline: 1.6rem;
      }
    }
  }

  &__stats {
    @include flex-cards(140px, 0.6rem);

    @include from('md') {
      @include flex-cards(240px, 0.9rem);
    }
  }

  &__section {
    @include flex(column, stretch, flex-start, 0.7rem);
  }

  &__section-head {
    @include flex(row, baseline, space-between, 0.5rem);
  }

  &__subtitle {
    @include display($text-xl, 600);
  }

  &__more {
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;
    padding: 0.5rem 0;
  }

  &__orders {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('md') {
      @include flex-cards(320px, 0.8rem);
      flex-direction: row;

      // Dos columnas fijas: la última tarjeta no se estira a todo el ancho
      > * {
        flex: 0 0 calc((100% - 0.8rem) / 2);
      }
    }
  }
}
</style>
