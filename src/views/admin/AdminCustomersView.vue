<script setup lang="ts">
import AdminSearch from '@/components/admin/AdminSearch.vue'
import AdminCustomerCard from '@/components/admin/AdminCustomerCard.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import { adminService } from '@/services/admin.service'
import { useAdminList } from '@/composables/useAdminList'
import type { AdminCustomer } from '@/types'

const { items, total, pages, page, q, loading } = useAdminList<AdminCustomer, Record<string, string>>(
  (query) => adminService.listCustomers({ q: query.q, page: query.page }),
  {},
)
</script>

<template>
  <section class="customers">
    <AdminSearch v-model="q" placeholder="Nombre, correo o celular" label="Buscar clientes" />
    <p v-if="!loading" class="customers__count">{{ total }} {{ total === 1 ? 'clienta' : 'clientas' }}</p>

    <AdminSkeleton v-if="loading" :rows="6" height="92px" />

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-user-group"
      :title="q ? 'Nadie coincide con tu búsqueda' : 'Aún no hay clientas registradas'"
      :text="q ? 'Prueba con otro nombre o correo.' : 'Cuando alguien cree su cuenta o compre, aparecerá aquí.'"
    />

    <div v-else class="customers__list">
      <AdminCustomerCard v-for="customer in items" :key="customer.id" :customer="customer" />
    </div>

    <AdminPagination v-model="page" :pages="pages" :total="total" />
  </section>
</template>

<style scoped lang="scss">
.customers {
  @include flex(column, stretch, flex-start, 0.8rem);

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
