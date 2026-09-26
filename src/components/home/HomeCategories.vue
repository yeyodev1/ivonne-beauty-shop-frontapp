<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{ categories: Category[]; loading: boolean }>()

// Sin foto de categoría, un icono según el nombre.
const ICONS: Array<[RegExp, string]> = [
  [/labi|lip|boca/i, 'fa-solid fa-face-kiss-wink-heart'],
  [/skin|piel|facial|crema|s[eé]rum/i, 'fa-solid fa-spa'],
  [/perfum|fragan|colonia|body/i, 'fa-solid fa-spray-can-sparkles'],
  [/bols|cartera|bag/i, 'fa-solid fa-bag-shopping'],
  [/ojo|pesta|ceja|eye/i, 'fa-solid fa-eye'],
  [/u[ñn]a|nail/i, 'fa-solid fa-hand-sparkles'],
  [/cabello|pelo|hair/i, 'fa-solid fa-wand-magic-sparkles'],
  [/brocha|accesor|herramienta/i, 'fa-solid fa-paintbrush'],
]
function iconFor(name: string): string {
  return ICONS.find(([re]) => re.test(name))?.[1] || 'fa-solid fa-star'
}
</script>

<template>
  <div class="cats" role="list">
    <template v-if="loading">
      <span v-for="n in 5" :key="n" class="cats__item cats__item--ghost" aria-hidden="true">
        <span class="cats__circle"></span>
      </span>
    </template>
    <RouterLink
      v-for="category in categories"
      v-else
      :key="category._id"
      :to="`/tienda?categoria=${category.slug}`"
      class="cats__item"
      role="listitem"
    >
      <span class="cats__circle">
        <img v-if="category.image" :src="category.image" :alt="category.name" loading="lazy" />
        <i v-else :class="iconFor(category.name)" aria-hidden="true"></i>
      </span>
      <span class="cats__name">{{ category.name }}</span>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.cats {
  @include flex(row, flex-start, flex-start, 0.9rem);
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  margin-inline: -1.25rem;
  padding: 0.25rem 1.25rem 0.5rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    margin-inline: 0;
    padding-inline: 0;
  }

  &__item {
    @include flex(column, center, flex-start, 0.55rem);
    flex: 0 0 84px;
    scroll-snap-align: start;
    text-align: center;
    @include focus-ring;

    @include from('md') {
      flex-basis: 116px;
    }

    &:hover .cats__circle {
      border-color: $accent;
      transform: translateY(-3px);
    }

    &--ghost .cats__circle {
      animation: ghost 1.6s ease-in-out infinite;
    }
  }

  &__circle {
    @include flex(row, center, center);
    width: 84px;
    height: 84px;
    border-radius: 50%;
    overflow: hidden;
    background: $sand;
    border: 2px solid $blush;
    color: $accent;
    font-size: 1.6rem;
    transition:
      transform 0.35s $ease,
      border-color 0.35s ease;

    @include from('md') {
      width: 116px;
      height: 116px;
      font-size: 2rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-size: $text-xs;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
  }
}

@keyframes ghost {
  50% {
    opacity: 0.5;
  }
}
</style>
