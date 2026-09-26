<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import CartLine from './CartLine.vue'
import CartSummary from './CartSummary.vue'
import CartEmpty from './CartEmpty.vue'

const cart = useCartStore()
const route = useRoute()

const open = computed(() => cart.drawerOpen)
useBodyScroll(open)

// Cualquier navegación cierra la bolsa.
watch(() => route.fullPath, () => cart.closeDrawer())

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && cart.drawerOpen) cart.closeDrawer()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

const countLabel = computed(() => (cart.count === 1 ? '1 producto' : `${cart.count} productos`))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="scrim" aria-hidden="true" @click="cart.closeDrawer()"></div>
    </Transition>
    <Transition name="drawer">
      <aside v-if="open" class="drawer" role="dialog" aria-modal="true" aria-label="Tu bolsa">
        <header class="drawer__head">
          <div>
            <h2 class="drawer__title">Tu <em>bolsa</em></h2>
            <p v-if="!cart.isEmpty" class="drawer__count">{{ countLabel }}</p>
          </div>
          <button
            type="button"
            class="drawer__close"
            aria-label="Cerrar la bolsa"
            @click="cart.closeDrawer()"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>

        <CartEmpty v-if="cart.isEmpty" class="drawer__empty" @navigate="cart.closeDrawer()" />

        <template v-else>
          <ul class="drawer__lines">
            <CartLine
              v-for="item in cart.items"
              :key="item.productId"
              :item="item"
              @navigate="cart.closeDrawer()"
            />
          </ul>
          <footer class="drawer__foot">
            <CartSummary @navigate="cart.closeDrawer()" />
            <RouterLink to="/carrito" class="drawer__link">Ver bolsa completa</RouterLink>
          </footer>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.scrim {
  position: fixed;
  inset: 0;
  background: $overlay;
  backdrop-filter: blur(2px);
  z-index: 210;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 220;
  width: min(420px, 100vw);
  @include flex(column, stretch, flex-start);
  background: $paper;
  box-shadow: $shadow-lg;

  &__head {
    @include flex(row, center, space-between);
    padding: 1rem 1.25rem;
    background: $sand;
    position: relative;

    // Festón de encaje bajo la cabecera, igual que el hero
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      height: 8px;
      background: radial-gradient(circle at 50% 0, $sand 7px, transparent 7.5px) 0 0 / 16px 8px
        repeat-x;
    }
  }

  &__title {
    @include display($text-xl, 500);

    em {
      color: $accent;
    }
  }

  &__count {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__close {
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
    border-radius: 50%;
    @include focus-ring;

    &:hover {
      background: $blush;
    }
  }

  &__empty {
    flex: 1;
  }

  &__lines {
    list-style: none;
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.5rem 1.25rem;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.4rem);
    padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
    background: $surface;
  }

  &__link {
    align-self: center;
    min-height: 44px;
    @include flex(row, center, center);
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.42s $ease;

  @include reduced-motion {
    transition: none;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
