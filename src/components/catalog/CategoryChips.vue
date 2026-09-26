<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{ categories: Category[]; active?: string }>()
const emit = defineEmits<{ select: [slug: string | undefined] }>()
</script>

<template>
  <nav class="chips" aria-label="Categorías">
    <button
      type="button"
      class="chips__chip"
      :class="{ 'chips__chip--on': !active }"
      :aria-pressed="!active"
      @click="emit('select', undefined)"
    >
      Todo
    </button>
    <button
      v-for="category in categories"
      :key="category._id"
      type="button"
      class="chips__chip"
      :class="{ 'chips__chip--on': active === category.slug }"
      :aria-pressed="active === category.slug"
      @click="emit('select', category.slug)"
    >
      {{ category.name }}
      <small v-if="category.productCount" class="chips__count">{{ category.productCount }}</small>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, center, flex-start, 0.5rem);
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  padding-block: 0.25rem;
  margin-inline: -1.25rem;
  padding-inline: 1.25rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    flex-wrap: wrap;
    margin-inline: 0;
    padding-inline: 0;
  }

  &__chip {
    @include flex(row, center, center, 0.4rem);
    flex-shrink: 0;
    scroll-snap-align: start;
    min-height: 44px;
    padding: 0 1.1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    white-space: nowrap;
    @include transition;
    @include focus-ring;

    &:hover {
      border-color: $accent;
      color: $accent-deep;
    }

    &--on {
      background: $ink;
      border-color: $ink;
      color: $surface;

      &:hover {
        color: $surface;
      }
    }
  }

  &__count {
    font-size: 0.68rem;
    opacity: 0.6;
  }
}
</style>
