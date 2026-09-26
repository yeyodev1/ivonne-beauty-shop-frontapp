<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminFormSection from '@/components/admin/AdminFormSection.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import AdminStockStepper from '@/components/admin/AdminStockStepper.vue'
import AdminTagsInput from '@/components/admin/AdminTagsInput.vue'
import AdminProductImages from '@/components/admin/AdminProductImages.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import { useAdminProductForm } from '@/composables/useAdminProductForm'

const { productId, isEdit, form, images, brands, categories, loading, saving, deleting, errors, save, remove, onImagesChange } =
  useAdminProductForm()

const confirmOpen = ref(false)

async function confirmDelete() {
  confirmOpen.value = false
  await remove()
}
</script>

<template>
  <section class="pform">
    <AdminSkeleton v-if="loading" :rows="4" height="160px" />

    <form v-else class="pform__form" novalidate @submit.prevent="save">
      <AdminFormSection title="Información" icon="fa-solid fa-tag">
        <div class="pform__field">
          <label for="p-name">Nombre</label>
          <input id="p-name" v-model="form.name" type="text" placeholder="Ej: Labial Soft Pinch Rare Beauty" :aria-invalid="Boolean(errors.name)" />
          <small v-if="errors.name" class="pform__error">{{ errors.name }}</small>
        </div>
        <div class="pform__pair">
          <div class="pform__field">
            <label for="p-brand">Marca</label>
            <input id="p-brand" v-model="form.brand" type="text" list="p-brands" placeholder="Ej: Rare Beauty" autocomplete="off" />
            <datalist id="p-brands">
              <option v-for="brand in brands" :key="brand" :value="brand" />
            </datalist>
          </div>
          <div class="pform__field">
            <label for="p-category">Categoría</label>
            <select id="p-category" v-model="form.category">
              <option value="">Sin categoría</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="pform__field">
          <label for="p-description">Descripción</label>
          <textarea id="p-description" v-model="form.description" rows="5" placeholder="Tono, tamaño, cómo se usa…"></textarea>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Precio y stock" icon="fa-solid fa-dollar-sign" hint="Precios en dólares, con punto o coma para los centavos.">
        <div class="pform__pair">
          <div class="pform__field">
            <label for="p-price">Precio</label>
            <div class="pform__money">
              <span aria-hidden="true">$</span>
              <input id="p-price" v-model="form.price" type="text" inputmode="decimal" placeholder="19.90" :aria-invalid="Boolean(errors.price)" />
            </div>
            <small v-if="errors.price" class="pform__error">{{ errors.price }}</small>
          </div>
          <div class="pform__field">
            <label for="p-compare">Precio anterior (opcional)</label>
            <div class="pform__money">
              <span aria-hidden="true">$</span>
              <input id="p-compare" v-model="form.compareAtPrice" type="text" inputmode="decimal" placeholder="25.00" />
            </div>
            <small class="pform__help">Se muestra tachado si es mayor al precio.</small>
          </div>
        </div>
        <AdminStockStepper id="p-stock" v-model="form.stock" label="Unidades en stock" />
      </AdminFormSection>

      <AdminFormSection title="Visibilidad" icon="fa-solid fa-eye">
        <AdminSwitch id="p-published" v-model="form.isPublished" label="Publicado" hint="Visible en la tienda" />
        <AdminSwitch id="p-featured" v-model="form.isFeatured" label="Destacado" hint="Aparece en la portada" />
        <AdminTagsInput id="p-tags" v-model="form.tags" label="Etiquetas" />
      </AdminFormSection>

      <div id="fotos" class="pform__anchor">
        <AdminFormSection title="Fotos" icon="fa-solid fa-camera" hint="La primera foto es la portada.">
          <AdminProductImages
            v-if="isEdit"
            :product-id="productId"
            :images="images"
            :name="form.name"
            @change="onImagesChange"
          />
          <p v-else class="pform__locked">
            <i class="fa-solid fa-lock" aria-hidden="true"></i>
            Guarda el producto primero y enseguida podrás subir sus fotos.
          </p>
        </AdminFormSection>
      </div>

      <button v-if="isEdit" type="button" class="pform__delete" :disabled="deleting" @click="confirmOpen = true">
        <i class="fa-solid fa-trash" aria-hidden="true"></i> Eliminar producto
      </button>

      <div class="pform__bar">
        <RouterLink :to="{ name: 'AdminProducts' }" class="btn btn--ghost pform__cancel">Cancelar</RouterLink>
        <button type="submit" class="btn btn--primary pform__save" :disabled="saving">
          <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'" aria-hidden="true"></i>
          {{ saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto' }}
        </button>
      </div>
    </form>

    <BaseModal
      :open="confirmOpen"
      title="¿Eliminar este producto?"
      :message="`Se borrará “${form.name}” y sus fotos. Esta acción no se puede deshacer.`"
      confirm-label="Sí, eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="confirmOpen = false"
    />
  </section>
</template>

<style scoped lang="scss">
.pform {
  &__form {
    @include flex(column, stretch, flex-start, 0.9rem);
    // Espacio para la barra de guardar fija
    padding-bottom: 5rem;

    @include from('lg') {
      padding-bottom: 0;
    }
  }

  &__field {
    @include flex(column, stretch, flex-start);
    min-width: 0;
  }

  &__pair {
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('md') {
      flex-direction: row;

      > * {
        flex: 1 1 0;
      }
    }
  }

  &__money {
    position: relative;

    span {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-weight: 600;
    }

    input {
      padding-left: 1.8rem;
      font-variant-numeric: tabular-nums;
    }
  }

  &__error {
    color: $danger;
    font-size: $text-xs;
    margin-top: 0.3rem;
  }

  &__help {
    color: $ink-muted;
    font-size: $text-xs;
    margin-top: 0.3rem;
  }

  &__anchor {
    scroll-margin-top: 70px;
  }

  &__locked {
    @include flex(row, center, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $ink-soft;
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.9rem;

    i {
      color: $accent;
    }
  }

  &__delete {
    align-self: center;
    min-height: 44px;
    padding: 0 1rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
    @include focus-ring;
  }

  &__bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(60px + env(safe-area-inset-bottom));
    z-index: 95;
    @include flex(row, center, flex-end, 0.5rem);
    padding: 0.6rem 1rem;
    background: rgba($surface, 0.97);
    border-top: 1px solid $line;
    box-shadow: 0 -8px 20px rgba($ink, 0.05);

    @include from('lg') {
      position: sticky;
      bottom: 0;
      margin-inline: -2rem;
      padding-inline: 2rem;
    }
  }

  &__cancel {
    display: none;

    @include from('md') {
      display: inline-flex;
    }
  }

  &__save {
    flex: 1 1 auto;
    min-height: 48px;

    @include from('md') {
      flex: 0 0 auto;
    }
  }
}
</style>
