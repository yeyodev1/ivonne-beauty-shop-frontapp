<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'

const props = defineProps<{ brands: string[]; active?: string; open: boolean }>()
const emit = defineEmits<{ select: [brand: string | undefined]; close: [] }>()

// En desktop el panel es fijo al costado; solo en móvil bloquea el scroll.
const isMobile = ref(false)
let media: MediaQueryList | null = null
const sync = () => (isMobile.value = !!media?.matches)
onMounted(() => {
  media = window.matchMedia('(max-width: 1023px)')
  sync()
  media.addEventListener('change', sync)
})
onUnmounted(() => media?.removeEventListener('change', sync))

const openRef = toRef(props, 'open')
useBodyScroll(computed(() => openRef.value && isMobile.value))

const filter = ref('')
const visible = computed(() => {
  const term = filter.value.trim().toLowerCase()
  return term ? props.brands.filter((b) => b.toLowerCase().includes(term)) : props.brands
})

function pick(brand: string | undefined) {
  emit('select', brand)
  emit('close')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="scrim" aria-hidden="true" @click="emit('close')"></div>
  </Transition>
  <aside class="brands" :class="{ 'brands--open': open }" aria-label="Filtrar por marca">
    <header class="brands__head">
      <h2 class="brands__title">Marcas</h2>
      <button type="button" class="brands__close" aria-label="Cerrar filtros" @click="emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </header>

    <div v-if="brands.length > 8" class="brands__find">
      <label for="brand-find" class="visually-hidden">Buscar marca</label>
      <input id="brand-find" v-model="filter" type="search" placeholder="Buscar marca" />
    </div>

    <ul class="brands__list">
      <li>
        <button
          type="button"
          class="brands__item"
          :class="{ 'brands__item--on': !active }"
          @click="pick(undefined)"
        >
          Todas las marcas
        </button>
      </li>
      <li v-for="brand in visible" :key="brand">
        <button
          type="button"
          class="brands__item"
          :class="{ 'brands__item--on': active === brand }"
          :aria-pressed="active === brand"
          @click="pick(brand)"
        >
          {{ brand }}
          <i v-if="active === brand" class="fa-solid fa-check" aria-hidden="true"></i>
        </button>
      </li>
    </ul>
  </aside>
</template>

<style scoped lang="scss">
.scrim {
  position: fixed;
  inset: 0;
  background: $overlay;
  z-index: 180;

  @include from('lg') {
    display: none;
  }
}

.brands {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 190;
  max-height: 78vh;
  @include flex(column, stretch, flex-start);
  background: $surface;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: 0.6rem 1.25rem 1.5rem;
  box-shadow: $shadow-lg;
  transform: translateY(105%);
  visibility: hidden;
  transition:
    transform 0.4s $ease,
    visibility 0.4s;

  &--open {
    transform: none;
    visibility: visible;
  }

  // Asa del bottom-sheet
  &::before {
    content: '';
    align-self: center;
    width: 42px;
    height: 4px;
    border-radius: $radius-pill;
    background: $line;
    margin-bottom: 0.6rem;
  }

  @include from('lg') {
    position: sticky;
    top: 6.5rem;
    z-index: 1;
    max-height: calc(100vh - 8rem);
    transform: none;
    visibility: visible;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    background: transparent;
    transition: none;

    &::before {
      display: none;
    }
  }

  &__head {
    @include flex(row, center, space-between);
    margin-bottom: 0.6rem;
  }

  &__title {
    @include display($text-xl, 500);
    font-style: italic;
  }

  &__close {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;

    @include from('lg') {
      display: none;
    }
  }

  &__find {
    margin-bottom: 0.6rem;
  }

  &__list {
    list-style: none;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  &__item {
    @include flex(row, center, space-between, 0.5rem);
    width: 100%;
    min-height: 44px;
    text-align: left;
    font-size: $text-sm;
    color: $ink-soft;
    border-bottom: 1px solid $line;
    @include focus-ring;

    &:hover {
      color: $accent-deep;
    }

    &--on {
      color: $accent-deep;
      font-weight: 600;
    }
  }
}
</style>
