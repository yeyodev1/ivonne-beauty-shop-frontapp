<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; pages: number }>()
const emit = defineEmits<{ go: [page: number] }>()

// Ventana corta: 1 … 4 5 6 … 12. En móvil no caben más de siete botones.
const items = computed<Array<number | '…'>>(() => {
  const { page, pages } = props
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const out: Array<number | '…'> = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pages - 1, page + 1)
  if (start > 2) out.push('…')
  for (let i = start; i <= end; i++) out.push(i)
  if (end < pages - 1) out.push('…')
  out.push(pages)
  return out
})
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button
      type="button"
      class="pager__btn"
      :disabled="page <= 1"
      aria-label="Página anterior"
      @click="emit('go', page - 1)"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <template v-for="(item, i) in items" :key="`${item}-${i}`">
      <span v-if="item === '…'" class="pager__gap">…</span>
      <button
        v-else
        type="button"
        class="pager__btn"
        :class="{ 'pager__btn--on': item === page }"
        :aria-current="item === page ? 'page' : undefined"
        @click="emit('go', item)"
      >
        {{ item }}
      </button>
    </template>
    <button
      type="button"
      class="pager__btn"
      :disabled="page >= pages"
      aria-label="Página siguiente"
      @click="emit('go', page + 1)"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, center, 0.3rem);
  flex-wrap: wrap;
  padding-top: $space-lg;

  &__btn {
    min-width: 44px;
    height: 44px;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    @include transition;
    @include focus-ring;

    &:hover:not(:disabled) {
      background: $sand;
      color: $accent-deep;
    }

    &--on {
      background: $accent;
      color: $surface;

      &:hover:not(:disabled) {
        background: $accent-deep;
        color: $surface;
      }
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &__gap {
    color: $ink-muted;
    padding-inline: 0.2rem;
  }
}
</style>
