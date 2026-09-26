<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import CatalogMenu from '@/components/catalog/CatalogMenu.vue'
import { useCatalogNavActive } from '@/composables/useCatalog'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cart = useCartStore()

const isActive = useCatalogNavActive(site.nav)
const menuOpen = ref(false)
const term = ref('')

// Al navegar se cierra el menú y el buscador refleja la búsqueda actual.
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    term.value = route.path === '/tienda' ? String(route.query.q || '') : ''
  },
  { immediate: true },
)

const account = computed(() => {
  if (userStore.isAdmin) return { to: '/admin', label: 'Panel de administración' }
  if (userStore.isAuthenticated) return { to: '/cuenta', label: 'Mi cuenta' }
  return { to: '/login', label: 'Ingresar' }
})

function search() {
  const q = term.value.trim()
  router.push({ path: '/tienda', query: q ? { q } : {} })
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <button
        type="button"
        class="header__icon header__burger"
        aria-label="Abrir menú"
        aria-controls="menu-principal"
        :aria-expanded="menuOpen"
        @click="menuOpen = true"
      >
        <i class="fa-solid fa-bars-staggered"></i>
      </button>

      <RouterLink to="/" class="logo" :aria-label="`${site.name}, inicio`">
        <span class="logo__main">IVONNE</span>
        <span class="logo__sub">BEAUTY SHOP</span>
      </RouterLink>

      <nav class="header__nav" aria-label="Secciones">
        <RouterLink
          v-for="link in site.nav"
          :key="link.to"
          :to="link.to"
          class="header__link"
          :class="{ 'header__link--on': isActive(link.to) }"
          active-class=""
          exact-active-class=""
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <form class="header__search" role="search" @submit.prevent="search">
        <label for="header-search" class="visually-hidden">Buscar en la tienda</label>
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input
          id="header-search"
          v-model="term"
          type="search"
          placeholder="¿Qué se te antoja hoy?"
          autocomplete="off"
          enterkeyhint="search"
        />
      </form>

      <div class="header__actions">
        <RouterLink :to="account.to" class="header__icon" :aria-label="account.label">
          <i :class="userStore.isAdmin ? 'fa-solid fa-gauge' : 'fa-regular fa-user'"></i>
        </RouterLink>
        <button
          type="button"
          class="header__icon header__cart"
          :aria-label="`Abrir bolsa, ${cart.count} productos`"
          @click="cart.openDrawer()"
        >
          <i class="fa-solid fa-bag-shopping"></i>
          <Transition name="fade">
            <span v-if="cart.count" :key="cart.count" class="header__badge">{{ cart.count }}</span>
          </Transition>
        </button>
      </div>
    </div>

    <CatalogMenu :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba($paper, 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid $line;

  &__inner {
    @include container(1240px);
    position: relative;
    @include flex(row, center, space-between, 0.25rem 0.5rem);
    flex-wrap: wrap;
    padding-block: 0.5rem 0.7rem;

    @include from('lg') {
      flex-wrap: nowrap;
      gap: 1.5rem;
      padding-block: 0.8rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 1.15rem;
    color: $ink;
    @include transition;
    @include focus-ring;

    &:hover {
      background: $sand;
      color: $accent;
    }
  }

  &__burger {
    @include from('lg') {
      display: none;
    }
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, flex-start, 1.4rem);
    }
  }

  &__link {
    @include eyebrow;
    color: $ink-soft;
    padding-block: 0.6rem;
    border-bottom: 1px solid transparent;
    white-space: nowrap;
    @include transition;

    &:hover,
    &--on {
      color: $accent-deep;
      border-color: $accent;
    }
  }

  // En móvil el buscador baja a su propia fila, a todo lo ancho.
  &__search {
    order: 5;
    flex: 1 1 100%;
    position: relative;

    @include from('lg') {
      order: 0;
      flex: 1 1 auto;
      max-width: 340px;
      margin-left: auto;
    }

    i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.85rem;
      pointer-events: none;
    }

    input {
      min-height: 44px;
      padding-left: 2.5rem;
      border-radius: $radius-pill;
      background: $sand;
      border-color: transparent;

      &:focus {
        background: $surface;
      }
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.1rem);
  }

  &__badge {
    position: absolute;
    top: 3px;
    right: 1px;
    min-width: 19px;
    height: 19px;
    padding-inline: 5px;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;
    font-size: 0.66rem;
    font-weight: 700;
    line-height: 19px;
    text-align: center;
    box-shadow: 0 0 0 2px $paper;
  }
}

.logo {
  @include flex(column, center, center);
  line-height: 1;
  text-align: center;
  padding-block: 0.2rem;
  @include focus-ring;

  @include until('lg') {
    position: absolute;
    left: 50%;
    top: 0.5rem;
    height: 44px;
    transform: translateX(-50%);
  }

  &__main {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.75rem;
    letter-spacing: 0.02em;
    color: $accent;

    @include from('lg') {
      font-size: 2rem;
    }
  }

  &__sub {
    font-family: $font-principal;
    font-size: 0.52rem;
    font-weight: 600;
    letter-spacing: 0.42em;
    // compensa el tracking del último carácter para que quede centrado
    margin-right: -0.42em;
    color: $accent;
    margin-top: 0.15rem;
  }
}
</style>
