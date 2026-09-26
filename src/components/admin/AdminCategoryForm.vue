<script setup lang="ts">
import AdminSwitch from './AdminSwitch.vue'
import type { Category } from '@/types'

defineProps<{
  form: { name: string; description: string; order: number; isActive: boolean }
  category: Category | null
  uploading: boolean
}>()
const emit = defineEmits<{ upload: [file: File | undefined] }>()

function onFile(event: Event) {
  const target = event.target as HTMLInputElement
  emit('upload', target.files?.[0])
  target.value = ''
}
</script>

<template>
  <div class="cform">
    <div>
      <label for="c-name">Nombre</label>
      <input id="c-name" v-model="form.name" type="text" placeholder="Ej: Labiales" />
    </div>
    <div>
      <label for="c-description">Descripción</label>
      <textarea id="c-description" v-model="form.description" rows="3" placeholder="Texto corto para la tienda"></textarea>
    </div>
    <div class="cform__order">
      <label for="c-order">Orden en la tienda</label>
      <input id="c-order" v-model.number="form.order" type="number" inputmode="numeric" min="0" />
      <small>Las de número menor salen primero.</small>
    </div>
    <AdminSwitch id="c-active" v-model="form.isActive" label="Activa" hint="Se muestra en la tienda" />

    <div class="cform__image">
      <p class="cform__label">Imagen</p>
      <template v-if="category">
        <div class="cform__preview">
          <img v-if="category.image" :src="category.image" :alt="category.name" />
          <span v-else class="cform__placeholder"><i class="fa-regular fa-image" aria-hidden="true"></i></span>
          <label class="btn btn--ghost cform__upload" :class="{ 'cform__upload--busy': uploading }">
            <i :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-camera'" aria-hidden="true"></i>
            {{ uploading ? 'Subiendo…' : category.image ? 'Cambiar imagen' : 'Subir imagen' }}
            <input class="visually-hidden" type="file" accept="image/*" :disabled="uploading" @change="onFile" />
          </label>
        </div>
      </template>
      <p v-else class="cform__hint">Guarda la categoría y luego podrás subirle una imagen.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cform {
  @include flex(column, stretch, flex-start, 0.9rem);

  input:not([type='checkbox']),
  textarea {
    font-size: 1rem;
  }

  &__order {
    small {
      display: block;
      font-size: $text-xs;
      color: $ink-muted;
      margin-top: 0.3rem;
    }

    input {
      max-width: 140px;
    }
  }

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
    margin-bottom: 0.4rem;
  }

  &__preview {
    @include flex(row, center, flex-start, 0.9rem);

    img,
    .cform__placeholder {
      flex: 0 0 72px;
      width: 72px;
      height: 72px;
      border-radius: 12px;
      object-fit: cover;
      background: $sand;
    }
  }

  &__placeholder {
    @include flex(row, center, center);
    color: $accent;
    font-size: 1.3rem;
  }

  &__upload {
    margin: 0;
    padding: 0.7rem 1.1rem;
    font-size: 0.8rem;
    cursor: pointer;

    &:focus-within {
      outline: 2px solid $accent;
      outline-offset: 3px;
    }

    &--busy {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.8rem;
  }
}
</style>
