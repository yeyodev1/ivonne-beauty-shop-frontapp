<script setup lang="ts">
defineProps<{ placeholder?: string; label?: string }>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="search">
    <label class="visually-hidden" for="admin-search">{{ label || 'Buscar' }}</label>
    <i class="fa-solid fa-magnifying-glass search__icon" aria-hidden="true"></i>
    <input
      id="admin-search"
      v-model="model"
      type="search"
      class="search__input"
      :placeholder="placeholder || 'Buscar'"
      autocomplete="off"
      enterkeyhint="search"
    />
    <button v-if="model" type="button" class="search__clear" aria-label="Limpiar búsqueda" @click="model = ''">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.search {
  position: relative;

  &__icon {
    position: absolute;
    left: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    font-size: 0.85rem;
    pointer-events: none;
  }

  &__input {
    min-height: 46px;
    padding-left: 2.5rem;
    padding-right: 2.6rem;
    border-radius: $radius-pill;
    // 16px evita que iOS haga zoom al enfocar
    font-size: 1rem;

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &__clear {
    position: absolute;
    right: 0.2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 42px;
    height: 42px;
    color: $ink-muted;
    border-radius: 50%;
  }
}
</style>
