<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminSheet from '@/components/admin/AdminSheet.vue'
import AdminCategoryForm from '@/components/admin/AdminCategoryForm.vue'
import AdminCategoryRow from '@/components/admin/AdminCategoryRow.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import { useAdminCategories } from '@/composables/useAdminCategories'
import { useAdminCategoryEditor } from '@/composables/useAdminCategoryEditor'

const { categories, loading, load } = useAdminCategories()
const { open, editing, form, saving, uploading, deleting, start, save, uploadImage, toggleActive, confirmDelete } =
  useAdminCategoryEditor()

const firstLoad = computed(() => loading.value && !categories.value.length)

// Siempre fresco al entrar: el conteo de productos cambia desde otras pantallas
onMounted(() => load(true))
</script>

<template>
  <section class="cats">
    <div class="cats__head">
      <p class="cats__count">{{ categories.length }} categorías</p>
      <button type="button" class="btn btn--primary cats__new" @click="start()">
        <i class="fa-solid fa-plus" aria-hidden="true"></i> Nueva categoría
      </button>
    </div>

    <AdminSkeleton v-if="firstLoad" :rows="5" height="72px" />

    <AdminEmpty
      v-else-if="!categories.length"
      icon="fa-solid fa-layer-group"
      title="Sin categorías todavía"
      text="Crea categorías como Labiales, Skincare o Perfumes para ordenar la tienda."
    />

    <div v-else class="cats__list">
      <AdminCategoryRow
        v-for="category in categories"
        :key="category._id"
        :category="category"
        @edit="start(category)"
        @toggle="toggleActive(category)"
        @remove="deleting = category"
      />
    </div>

    <AdminSheet :open="open" :title="editing ? 'Editar categoría' : 'Nueva categoría'" @close="open = false">
      <form id="category-form" @submit.prevent="save">
        <AdminCategoryForm :form="form" :category="editing" :uploading="uploading" @upload="uploadImage" />
      </form>
      <template #footer>
        <button type="button" class="btn btn--ghost" @click="open = false">Cerrar</button>
        <button type="submit" form="category-form" class="btn btn--primary" :disabled="saving">
          {{ saving ? 'Guardando…' : 'Guardar' }}
        </button>
      </template>
    </AdminSheet>

    <BaseModal
      :open="Boolean(deleting)"
      title="¿Eliminar categoría?"
      :message="`Se eliminará “${deleting?.name}”. Solo se puede borrar si no tiene productos.`"
      confirm-label="Sí, eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="deleting = null"
    />
  </section>
</template>

<style scoped lang="scss">
.cats {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__head {
    @include flex(row, center, space-between, 0.6rem);
  }

  &__count {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__new {
    min-height: 44px;
    padding-inline: 1.1rem;
    font-size: 0.8rem;
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
}
</style>
