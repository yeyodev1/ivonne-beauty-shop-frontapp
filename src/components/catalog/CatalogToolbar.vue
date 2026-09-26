<script setup lang="ts">
import { ref, watch } from 'vue'
import { SORT_OPTIONS } from '@/composables/useCatalog'
import type { ProductQuery } from '@/types'

const props = defineProps<{ q?: string; sort?: ProductQuery['sort']; brand?: string }>()
const emit = defineEmits<{ search: [q: string]; sort: [sort: string]; filters: [] }>()

const term = ref(props.q || '')
watch(
  () => props.q,
  (value) => (term.value = value || ''),
)
</script>

<template>
  <div class="toolbar">
    <form class="toolbar__search" role="search" @submit.prevent="emit('search', term.trim())">
      <label for="catalog-search" class="visually-hidden">Buscar productos</label>
      <i class="fa-solid fa-magnifying-glass toolbar__search-icon" aria-hidden="true"></i>
      <input
        id="catalog-search"
        v-model="term"
        type="search"
        placeholder="Busca labiales, sérums, marcas…"
        autocomplete="off"
        enterkeyhint="search"
      />
    </form>

    <div class="toolbar__row">
      <button type="button" class="toolbar__filter" @click="emit('filters')">
        <i class="fa-solid fa-sliders"></i>
        Marcas
        <span v-if="brand" class="toolbar__dot" aria-label="Filtro activo"></span>
      </button>

      <div class="toolbar__sort">
        <label for="catalog-sort" class="visually-hidden">Ordenar por</label>
        <select
          id="catalog-sort"
          :value="sort || 'new'"
          @change="emit('sort', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  @include flex(column, stretch, flex-start, 0.6rem);

  @include from('md') {
    flex-direction: row;
    align-items: center;
  }

  &__search {
    position: relative;
    flex: 1;

    input {
      min-height: 46px;
      padding-left: 2.6rem;
      border-radius: $radius-pill;
    }
  }

  &__search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    font-size: 0.9rem;
    pointer-events: none;
  }

  &__row {
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__filter {
    @include flex(row, center, center, 0.5rem);
    position: relative;
    min-height: 46px;
    padding: 0 1.1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;
    flex-shrink: 0;
    @include focus-ring;

    @include from('lg') {
      display: none;
    }
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $accent;
  }

  &__sort {
    flex: 1;

    select {
      min-height: 46px;
      border-radius: $radius-pill;
      padding-inline: 1.1rem 2rem;
      font-size: $text-sm;
      cursor: pointer;
    }

    @include from('md') {
      min-width: 220px;
    }
  }
}
</style>
