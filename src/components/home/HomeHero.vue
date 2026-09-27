<script setup lang="ts">
import { computed, reactive } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { productCover } from '@/utils/format'
import type { Product } from '@/types'

const props = defineProps<{ products: Product[] }>()

// La palabra "bella" va en cursiva fucsia; si el copy cambia, la última palabra.
const title = computed(() => {
  const text: string = site.hero.title
  const match = text.match(/bella/i) || text.match(/(\S+)$/)
  if (!match || match.index === undefined) return { before: text, accent: '', after: '' }
  const word = match[0]
  return {
    before: text.slice(0, match.index),
    accent: word,
    after: text.slice(match.index + word.length),
  }
})

// Tres "espejos de tocador" con productos reales. Mientras llegan los
// productos se reservan los tres arcos vacíos: si se pintara uno y luego tres,
// el hero saltaría.
const mirrors = computed(() => {
  const withImages = props.products.filter((p) => p.images?.length).slice(0, 3)
  return [0, 1, 2].map((i) => {
    const p = withImages[i]
    return p
      ? { src: productCover(p.images), alt: p.name, to: `/producto/${p.slug}` }
      : { src: '', alt: '', to: '/tienda' }
  })
})

// Cada foto entra con fundido cuando termina de cargar, no de golpe.
const loaded = reactive<Record<string, boolean>>({})
function onImage(event: Event) {
  const img = event.target as HTMLImageElement
  loaded[img.currentSrc || img.src] = true
}
function markIfCached(el: unknown) {
  const img = el as HTMLImageElement | null
  if (img?.complete && img.naturalWidth) loaded[img.currentSrc || img.src] = true
}
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ site.hero.eyebrow }}
        </p>
        <h1 class="hero__title">
          {{ title.before }}<em>{{ title.accent }}</em>{{ title.after }}
        </h1>
        <p class="hero__text">{{ site.hero.text }}</p>
        <div class="hero__actions">
          <RouterLink to="/tienda" class="btn btn--primary hero__btn">
            {{ site.hero.primaryCta }} <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
          <a :href="whatsappLink()" class="btn btn--ghost hero__btn" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp"></i> {{ site.hero.secondaryCta }}
          </a>
        </div>
      </div>

      <div class="hero__mirrors">
        <RouterLink
          v-for="(mirror, i) in mirrors"
          :key="i"
          :to="mirror.to"
          class="hero__mirror"
          :class="`hero__mirror--${i + 1}`"
        >
          <img
            v-if="mirror.src"
            :ref="markIfCached"
            :src="mirror.src"
            :alt="mirror.alt"
            :class="{ 'is-loaded': loaded[mirror.src] }"
            fetchpriority="high"
            @load="onImage"
          />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  background: $sand;
  padding-block: 2.25rem 3.5rem;

  // Festón de encaje: la firma de la marca en cada borde rosado
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: 12px;
    background: radial-gradient(circle at 50% 0, $sand 11px, transparent 11.5px) 0 0 / 24px 12px
      repeat-x;
  }

  @include from('md') {
    padding-block: 4rem 5rem;
  }

  &__inner {
    @include container(1180px);
    @include flex(column, stretch, flex-start, 2.25rem);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 3rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1rem);

    @include from('md') {
      flex: 1 1 55%;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-lg);
    font-size: clamp(2.9rem, 1.6rem + 6vw, 5.6rem);
    line-height: 0.98;
    color: $ink;

    em {
      color: $accent;
      font-style: italic;
    }
  }

  &__text {
    color: $ink-soft;
    font-size: $text-base;
    max-width: 46ch;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);
    width: 100%;
    margin-top: 0.4rem;

    @include from('sm') {
      flex-direction: row;
      width: auto;
    }
  }

  &__btn {
    min-height: 50px;
  }

  &__mirrors {
    @include flex(row, flex-end, center, 0.6rem);

    @include from('md') {
      flex: 1 1 45%;
      gap: 0.9rem;
    }
  }

  &__mirror {
    display: block;
    flex: 1 1 0;
    max-width: 200px;
    aspect-ratio: 3 / 4.2;
    border-radius: 999px 999px $radius-md $radius-md;
    overflow: hidden;
    background: $surface;
    border: 5px solid $surface;
    box-shadow: $shadow-md;
    transition: transform 0.5s $ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transform: scale(1.04);
      transition:
        opacity 0.7s $ease,
        transform 1.2s $ease;

      &.is-loaded {
        opacity: 1;
        transform: none;
      }
    }

    &:hover {
      transform: translateY(-6px);
    }

    &--2 {
      transform: translateY(-1.5rem);

      &:hover {
        transform: translateY(-1.9rem);
      }
    }

    @include reduced-motion {
      transition: none;
    }
  }
}
</style>
