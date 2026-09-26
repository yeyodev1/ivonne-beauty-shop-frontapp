<script setup lang="ts">
import { computed } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const year = new Date().getFullYear()

const accountLinks = computed(() =>
  userStore.isAuthenticated
    ? [
        { label: 'Mi cuenta', to: '/cuenta' },
        { label: 'Mis pedidos', to: '/cuenta/pedidos' },
      ]
    : [
        { label: 'Ingresar', to: '/login' },
        { label: 'Crear cuenta', to: '/registro' },
      ],
)
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo" :aria-label="`${site.name}, inicio`">
          <span class="footer__logo-main">IVONNE</span>
          <span class="footer__logo-sub">BEAUTY SHOP</span>
        </RouterLink>
        <p class="footer__tagline">{{ site.tagline }}</p>
        <div class="footer__social">
          <a :href="site.social.instagram" target="_blank" rel="noopener" aria-label="Instagram">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a :href="site.social.tiktok" target="_blank" rel="noopener" aria-label="TikTok">
            <i class="fa-brands fa-tiktok"></i>
          </a>
          <a :href="whatsappLink()" target="_blank" rel="noopener" aria-label="WhatsApp">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">Visítanos</h2>
        <a :href="site.address.mapsUrl" target="_blank" rel="noopener" class="footer__address">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          <span>
            {{ site.address.street }}<br />
            {{ site.address.reference }}<br />
            {{ site.address.city }}
          </span>
        </a>
        <a :href="whatsappLink()" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ site.whatsappDisplay }}
        </a>
        <a :href="site.whatsappCatalog" target="_blank" rel="noopener">
          <i class="fa-solid fa-book-open" aria-hidden="true"></i> Catálogo de WhatsApp
        </a>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">Tienda</h2>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/carrito">Mi bolsa</RouterLink>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">Cuenta</h2>
        <RouterLink v-for="link in accountLinks" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
      </div>
    </div>

    <p class="footer__returns">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
      {{ site.legal.returns }}
    </p>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }} · Machala, Ecuador</span>
      <span class="footer__credit">
        Hecho por <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a>
      </span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  position: relative;
  background: $ink;
  color: rgba($paper, 0.82);
  margin-top: 3rem;

  // El festón de encaje, ahora colgando hacia arriba en tinta
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    height: 12px;
    background: radial-gradient(circle at 50% 100%, $ink 11px, transparent 11.5px) 0 0 / 24px 12px
      repeat-x;
  }

  &__inner {
    @include container(1180px);
    @include flex-cards(200px, 2rem);
    padding-block: 3rem 2rem;
  }

  &__brand {
    flex: 1 1 100%;

    @include from('md') {
      flex: 1.6 1 260px;
    }
  }

  &__logo {
    @include flex(column, flex-start, flex-start);
    line-height: 1;
    margin-bottom: 0.8rem;
  }

  &__logo-main {
    font-family: $font-display;
    font-weight: 700;
    font-size: 2.2rem;
    color: $accent;
  }

  &__logo-sub {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.42em;
    color: $blush;
    margin-top: 0.2rem;
  }

  &__tagline {
    font-size: $text-sm;
    color: rgba($paper, 0.6);
    max-width: 30ch;
  }

  &__social {
    @include flex(row, center, flex-start, 0.4rem);
    margin-top: 1rem;

    a {
      @include flex(row, center, center);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba($paper, 0.2);
      color: $paper;
      font-size: 1.05rem;
      @include transition;

      &:hover {
        background: $accent;
        border-color: $accent;
      }
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.2rem);
    font-size: $text-sm;

    a {
      min-height: 36px;
      @include flex(row, center, flex-start, 0.5rem);
      color: rgba($paper, 0.78);
      @include transition(color);

      &:hover {
        color: $blush;
      }

      i {
        color: $accent;
        width: 1rem;
      }
    }
  }

  &__col &__address {
    align-items: flex-start;
    line-height: 1.5;
    padding-block: 0.3rem;

    i {
      margin-top: 0.3rem;
    }
  }

  &__heading {
    @include eyebrow;
    color: $blush;
    margin-bottom: 0.5rem;
  }

  &__returns {
    @include container(1180px);
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: $text-xs;
    line-height: 1.6;
    color: rgba($paper, 0.55);
    padding-bottom: 1.5rem;

    i {
      margin-top: 0.25rem;
      color: $blush;
    }
  }

  &__bar {
    @include container(1180px);
    @include flex(row, center, space-between, 0.5rem 1rem);
    flex-wrap: wrap;
    padding-block: 1.2rem calc(1.2rem + env(safe-area-inset-bottom));
    border-top: 1px solid rgba($paper, 0.1);
    font-size: $text-xs;
    color: rgba($paper, 0.5);
  }

  &__credit a {
    color: rgba($paper, 0.8);
  }
}
</style>
