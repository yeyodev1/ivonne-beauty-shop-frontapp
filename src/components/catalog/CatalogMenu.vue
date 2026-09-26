<script setup lang="ts">
import { onMounted, onUnmounted, toRef } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useCatalogNavActive, useCatalogTaxonomy } from '@/composables/useCatalog'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

useBodyScroll(toRef(props, 'open'))
const { categories } = useCatalogTaxonomy()
const isActive = useCatalogNavActive(site.nav)

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close')
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="scrim" aria-hidden="true" @click="emit('close')"></div>
    </Transition>
    <Transition name="menu">
      <nav v-if="open" id="menu-principal" class="menu" aria-label="Menú principal">
        <header class="menu__head">
          <span class="menu__hello">Hola <em>bella</em></span>
          <button type="button" class="menu__close" aria-label="Cerrar menú" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>

        <ul class="menu__nav">
          <li v-for="link in site.nav" :key="link.to">
            <RouterLink
              :to="link.to"
              class="menu__link"
              :class="{ 'menu__link--on': isActive(link.to) }"
              exact-active-class=""
              @click="emit('close')"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <template v-if="categories.length">
          <p class="menu__label">Categorías</p>
          <ul class="menu__cats">
            <li v-for="category in categories" :key="category._id">
              <RouterLink
                :to="`/tienda?categoria=${category.slug}`"
                class="menu__cat"
                @click="emit('close')"
              >
                {{ category.name }}
                <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
              </RouterLink>
            </li>
          </ul>
        </template>

        <footer class="menu__foot">
          <a :href="whatsappLink()" class="btn btn--primary" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp"></i> Escríbenos
          </a>
          <div class="menu__social">
            <a :href="site.social.instagram" target="_blank" rel="noopener" aria-label="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a :href="site.social.tiktok" target="_blank" rel="noopener" aria-label="TikTok">
              <i class="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </footer>
      </nav>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.scrim {
  position: fixed;
  inset: 0;
  background: $overlay;
  z-index: 210;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 220;
  width: min(340px, 88vw);
  @include flex(column, stretch, flex-start);
  background: $paper;
  overflow-y: auto;
  padding: 0 1.25rem calc(1.25rem + env(safe-area-inset-bottom));

  &__head {
    @include flex(row, center, space-between);
    padding-block: 0.9rem 0.6rem;
  }

  &__hello {
    @include display($text-xl, 500);

    em {
      color: $accent;
    }
  }

  &__close {
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
  }

  &__nav,
  &__cats {
    list-style: none;
  }

  &__link {
    @include flex(row, center, flex-start);
    min-height: 52px;
    font-family: $font-display;
    font-size: 1.45rem;
    border-bottom: 1px solid $line;

    &--on {
      color: $accent;
      font-style: italic;
    }
  }

  &__label {
    @include eyebrow;
    margin: 1.5rem 0 0.3rem;
  }

  &__cat {
    @include flex(row, center, space-between);
    min-height: 46px;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;

    i {
      font-size: 0.6rem;
      color: $ink-muted;
    }

    &:hover {
      color: $accent-deep;
    }
  }

  &__foot {
    @include flex(row, center, space-between, 0.8rem);
    margin-top: auto;
    padding-top: 1.5rem;
  }

  &__social {
    @include flex(row, center, flex-end, 0.2rem);

    a {
      @include flex(row, center, center);
      width: 44px;
      height: 44px;
      font-size: 1.2rem;
      color: $ink;

      &:hover {
        color: $accent;
      }
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: transform 0.4s $ease;

  @include reduced-motion {
    transition: none;
  }
}

.menu-enter-from,
.menu-leave-to {
  transform: translateX(-100%);
}
</style>
