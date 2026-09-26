<script setup lang="ts">
import AdminChip from './AdminChip.vue'
import type { Category } from '@/types'

defineProps<{ category: Category }>()
const emit = defineEmits<{ edit: []; toggle: []; remove: [] }>()
</script>

<template>
  <article class="crow" :class="{ 'crow--off': !category.isActive }">
    <button type="button" class="crow__main" :aria-label="`Editar ${category.name}`" @click="emit('edit')">
      <img v-if="category.image" class="crow__img" :src="category.image" :alt="category.name" loading="lazy" />
      <span v-else class="crow__img crow__img--empty" aria-hidden="true"><i class="fa-regular fa-image"></i></span>
      <span class="crow__info">
        <span class="crow__name">{{ category.name }}</span>
        <span class="crow__meta">
          <AdminChip tone="neutral">{{ category.productCount ?? 0 }} productos</AdminChip>
          <AdminChip tone="neutral">Orden {{ category.order }}</AdminChip>
          <AdminChip :tone="category.isActive ? 'success' : 'warning'">
            {{ category.isActive ? 'Activa' : 'Oculta' }}
          </AdminChip>
        </span>
      </span>
    </button>
    <div class="crow__actions">
      <button
        type="button"
        class="crow__btn"
        :class="{ 'crow__btn--on': category.isActive }"
        :aria-label="category.isActive ? 'Ocultar categoría' : 'Activar categoría'"
        :aria-pressed="category.isActive"
        @click="emit('toggle')"
      >
        <i :class="category.isActive ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
      </button>
      <button type="button" class="crow__btn crow__btn--danger" aria-label="Eliminar categoría" @click="emit('remove')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.crow {
  @include card;
  @include flex(row, center, flex-start, 0.3rem);
  padding: 0.55rem 0.4rem 0.55rem 0.55rem;

  &--off &__img {
    opacity: 0.55;
  }

  &__main {
    flex: 1 1 auto;
    min-width: 0;
    @include flex(row, center, flex-start, 0.75rem);
    text-align: left;
    @include focus-ring;
  }

  &__img {
    flex: 0 0 56px;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    object-fit: cover;
    background: $sand;

    &--empty {
      @include flex(row, center, center);
      color: $accent;
    }
  }

  &__info {
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.3rem);
  }

  &__name {
    font-weight: 600;
    font-size: 0.92rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.3rem);
    flex-wrap: wrap;
  }

  &__actions {
    @include flex(column, center, center, 0.1rem);

    @include from('md') {
      flex-direction: row;
    }
  }

  &__btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $ink-muted;
    @include focus-ring;

    &--on {
      color: $success;
    }

    &--danger:hover {
      color: $danger;
    }
  }
}
</style>
