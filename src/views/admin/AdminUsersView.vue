<script setup lang="ts">
import { computed } from 'vue'
import AdminSearch from '@/components/admin/AdminSearch.vue'
import AdminFilterChips from '@/components/admin/AdminFilterChips.vue'
import AdminUserCard from '@/components/admin/AdminUserCard.vue'
import AdminUserForm from '@/components/admin/AdminUserForm.vue'
import AdminSheet from '@/components/admin/AdminSheet.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import { adminService } from '@/services/admin.service'
import { useAdminList } from '@/composables/useAdminList'
import { useAdminUserEditor } from '@/composables/useAdminUserEditor'
import { useUserStore } from '@/stores/user'
import type { AccountType, AdminUser } from '@/types'

const FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'admin', label: 'Administración' },
  { value: 'customer', label: 'Clientas' },
]

const userStore = useUserStore()

const { items, total, pages, page, q, filters, loading, reload } = useAdminList<AdminUser, { accountType: string }>(
  (query) =>
    adminService.listUsers({ q: query.q, page: query.page, accountType: query.accountType as AccountType | '' }),
  { accountType: '' },
)

const { open, editing, form, saving, start, save } = useAdminUserEditor(reload)

const isSelf = computed(() => Boolean(editing.value && editing.value.id === userStore.user?.id))
</script>

<template>
  <section class="users">
    <div class="users__head">
      <p v-if="!loading" class="users__count">{{ total }} {{ total === 1 ? 'cuenta' : 'cuentas' }}</p>
      <button type="button" class="btn btn--primary users__new" @click="start()">
        <i class="fa-solid fa-user-plus" aria-hidden="true"></i> Nuevo usuario
      </button>
    </div>

    <AdminSearch v-model="q" placeholder="Nombre, correo o celular" label="Buscar usuarios" />
    <AdminFilterChips v-model="filters.accountType" :options="FILTERS" label="Tipo de cuenta" />

    <AdminSkeleton v-if="loading" :rows="6" height="84px" />

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-user-shield"
      title="Nadie coincide con tu búsqueda"
      text="Prueba con otro nombre, correo o filtro."
    />

    <div v-else class="users__list">
      <AdminUserCard
        v-for="user in items"
        :key="user.id"
        :user="user"
        :is-self="user.id === userStore.user?.id"
        @edit="start(user)"
      />
    </div>

    <AdminPagination v-model="page" :pages="pages" :total="total" />

    <AdminSheet :open="open" :title="editing ? 'Editar usuario' : 'Nuevo usuario'" @close="open = false">
      <form id="user-form" @submit.prevent="save">
        <AdminUserForm :form="form" :user="editing" :is-self="isSelf" />
      </form>
      <template #footer>
        <button type="button" class="btn btn--ghost" @click="open = false">Cerrar</button>
        <button type="submit" form="user-form" class="btn btn--primary" :disabled="saving">
          {{ saving ? 'Guardando…' : editing ? 'Guardar' : 'Crear usuario' }}
        </button>
      </template>
    </AdminSheet>
  </section>
</template>

<style scoped lang="scss">
.users {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__head {
    @include flex(row, center, space-between, 0.6rem);
  }

  &__count {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__new {
    margin-left: auto;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.55rem);

    @include from('lg') {
      @include flex-cards(420px, 0.7rem);
      flex-direction: row;

      > * {
        flex: 0 0 calc((100% - 0.7rem) / 2);
      }
    }
  }
}
</style>
