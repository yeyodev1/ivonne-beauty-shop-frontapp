<script setup lang="ts">
defineProps<{ pages: number; total?: number }>()

const page = defineModel<number>({ required: true })
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button
      type="button"
      class="pager__btn"
      :disabled="page <= 1"
      aria-label="Página anterior"
      @click="page--"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <span class="pager__info">
      Página <strong>{{ page }}</strong> de {{ pages }}
      <small v-if="total !== undefined">· {{ total }} en total</small>
    </span>
    <button
      type="button"
      class="pager__btn"
      :disabled="page >= pages"
      aria-label="Página siguiente"
      @click="page++"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, space-between, 0.6rem);
  margin-top: 1.2rem;

  @include from('md') {
    justify-content: center;
    gap: 1.2rem;
  }

  &__btn {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1px solid $line;
    background: $surface;
    color: $ink;
    @include focus-ring;

    &:disabled {
      opacity: 0.35;
      pointer-events: none;
    }
  }

  &__info {
    font-size: $text-sm;
    color: $ink-soft;
    text-align: center;

    small {
      display: block;
      color: $ink-muted;
      font-size: $text-xs;
    }
  }
}
</style>
