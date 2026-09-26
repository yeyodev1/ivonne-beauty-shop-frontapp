<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import { useSettings } from '@/composables/useSettings'
import { whatsappLink } from '@/config/site'

const route = useRoute()
const { settings } = useSettings()

// El panel tiene su propio layout: nada de header, footer ni botón flotante.
const isAdmin = computed(() => route.matched.some((r) => r.meta.admin))
// En la ficha de producto hay barra fija abajo en móvil: el botón sube.
const fabRaised = computed(() => route.name === 'Product')
</script>

<template>
  <div class="app">
    <template v-if="!isAdmin">
      <p v-if="settings.announcement" class="app__announce">
        <i class="fa-solid fa-heart" aria-hidden="true"></i>
        <span>{{ settings.announcement }}</span>
      </p>
      <TheHeader />
    </template>

    <main class="app__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <template v-if="!isAdmin">
      <TheFooter />
      <CartDrawer />
      <a
        :href="whatsappLink()"
        class="app__fab"
        :class="{ 'app__fab--raised': fabRaised }"
        target="_blank"
        rel="noopener"
        aria-label="Escríbenos por WhatsApp"
      >
        <i class="fa-brands fa-whatsapp"></i>
      </a>
    </template>
    <ToastList />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__announce {
    position: relative;
    z-index: 101;
    @include flex(row, center, center, 0.55rem);
    background: $accent;
    color: $surface;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-align: center;
    padding: 0.5rem 1.25rem;
    line-height: 1.4;

    i {
      font-size: 0.6rem;
      opacity: 0.8;
    }
  }

  &__fab {
    position: fixed;
    right: 1rem;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    z-index: 90;
    @include flex(row, center, center);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #25d366;
    color: $surface;
    font-size: 1.7rem;
    box-shadow: 0 10px 28px rgba(#25d366, 0.35);
    transition:
      transform 0.3s $ease,
      bottom 0.3s $ease;
    @include focus-ring;

    &:hover {
      transform: scale(1.06);
    }

    &--raised {
      bottom: calc(5.4rem + env(safe-area-inset-bottom));

      @include from('md') {
        bottom: 1.5rem;
      }
    }

    @include from('md') {
      right: 1.5rem;
      bottom: 1.5rem;
    }
  }
}
</style>
