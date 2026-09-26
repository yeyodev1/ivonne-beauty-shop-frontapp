<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ProductImage } from '@/types'

const props = defineProps<{ images: ProductImage[]; name: string; badge?: string }>()

const track = ref<HTMLElement | null>(null)
const current = ref(0)

const slides = computed(() =>
  props.images.length ? props.images : [{ url: '/placeholder-product.svg', publicId: '' }],
)

watch(
  () => props.images,
  () => {
    current.value = 0
    track.value?.scrollTo({ left: 0 })
  },
)

// El índice sale del scroll: así el swipe nativo y las miniaturas no se pelean.
function onScroll() {
  const el = track.value
  if (!el) return
  current.value = Math.round(el.scrollLeft / el.clientWidth)
}

function go(index: number) {
  const el = track.value
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollTo({ left: index * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  current.value = index
}
</script>

<template>
  <div class="gallery">
    <div class="gallery__stage">
      <div
        ref="track"
        class="gallery__track"
        tabindex="0"
        :aria-label="`Fotos de ${name}`"
        @scroll.passive="onScroll"
      >
        <figure v-for="(image, i) in slides" :key="image.url + i" class="gallery__slide">
          <img
            :src="image.url"
            :alt="slides.length > 1 ? `${name} — foto ${i + 1} de ${slides.length}` : name"
            :loading="i === 0 ? 'eager' : 'lazy'"
          />
        </figure>
      </div>
      <span v-if="badge" class="gallery__badge">{{ badge }}</span>
      <div v-if="slides.length > 1" class="gallery__dots" aria-hidden="true">
        <span
          v-for="(_, i) in slides"
          :key="i"
          class="gallery__dot"
          :class="{ 'gallery__dot--on': i === current }"
        ></span>
      </div>
    </div>

    <div v-if="slides.length > 1" class="gallery__thumbs">
      <button
        v-for="(image, i) in slides"
        :key="`t-${image.url}-${i}`"
        type="button"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--on': i === current }"
        :aria-label="`Ver foto ${i + 1}`"
        :aria-current="i === current"
        @click="go(i)"
      >
        <img :src="image.url" alt="" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.75rem);
  min-width: 0;

  &__stage {
    position: relative;
    border-radius: $radius-lg;
    overflow: hidden;
    background: $sand;
  }

  &__track {
    @include flex(row, stretch, flex-start);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    overscroll-behavior-x: contain;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__slide {
    flex: 0 0 100%;
    aspect-ratio: 1;
    scroll-snap-align: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: $accent;
    color: $surface;
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 0.35rem 0.8rem;
    border-radius: $radius-pill;
  }

  &__dots {
    position: absolute;
    bottom: 0.9rem;
    left: 50%;
    transform: translateX(-50%);
    @include flex(row, center, center, 0.35rem);
    padding: 0.35rem 0.55rem;
    border-radius: $radius-pill;
    background: rgba($surface, 0.75);
    backdrop-filter: blur(6px);

    @include from('md') {
      display: none;
    }
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: $radius-pill;
    background: rgba($ink, 0.25);
    @include transition(width);

    &--on {
      width: 16px;
      background: $accent;
    }
  }

  &__thumbs {
    display: none;

    @include from('md') {
      @include flex(row, center, flex-start, 0.6rem);
      overflow-x: auto;
      padding: 0.2rem;
    }
  }

  &__thumb {
    flex: 0 0 72px;
    height: 72px;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $sand;
    border: 2px solid transparent;
    opacity: 0.7;
    @include transition;
    @include focus-ring;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover,
    &--on {
      opacity: 1;
    }

    &--on {
      border-color: $accent;
    }
  }
}
</style>
