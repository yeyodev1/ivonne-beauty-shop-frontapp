<script setup lang="ts">
import AdminFormSection from '@/components/admin/AdminFormSection.vue'
import AdminShippingOption from '@/components/admin/AdminShippingOption.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import { useAdminSettings } from '@/composables/useAdminSettings'

const { announcement, shipping, loading, saving, save } = useAdminSettings()
</script>

<template>
  <section class="settings">
    <AdminSkeleton v-if="loading" :rows="3" height="160px" />

    <form v-else class="settings__form" @submit.prevent="save">
      <AdminFormSection
        title="Anuncio de la barra superior"
        icon="fa-solid fa-bullhorn"
        hint="Déjalo vacío para ocultar la barra."
      >
        <div>
          <label for="announcement">Texto del anuncio</label>
          <input
            id="announcement"
            v-model="announcement"
            type="text"
            maxlength="140"
            placeholder="Ej: Envíos a todo Ecuador"
          />
          <small class="settings__counter">{{ announcement.length }}/140</small>
        </div>
        <p v-if="announcement.trim()" class="settings__preview" aria-label="Vista previa del anuncio">
          {{ announcement }}
        </p>
      </AdminFormSection>

      <AdminFormSection
        title="Opciones de envío"
        icon="fa-solid fa-truck-fast"
        hint="Precios en dólares. Pon 0 para que sea gratis."
      >
        <AdminShippingOption v-for="option in shipping" :key="option.id" :option="option" />
        <p v-if="!shipping.length" class="settings__empty">No hay opciones de envío configuradas.</p>
      </AdminFormSection>

      <div class="settings__bar">
        <button type="submit" class="btn btn--primary" :disabled="saving">
          <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'" aria-hidden="true"></i>
          {{ saving ? 'Guardando…' : 'Guardar ajustes' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.settings {
  &__form {
    @include flex(column, stretch, flex-start, 0.9rem);
  }

  &__counter {
    display: block;
    text-align: right;
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.25rem;
  }

  &__preview {
    background: $accent;
    color: $surface;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-align: center;
    border-radius: $radius-sm;
    padding: 0.55rem 0.8rem;
  }

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__bar {
    .btn {
      width: 100%;
      min-height: 48px;

      @include from('md') {
        width: auto;
      }
    }
  }
}
</style>
