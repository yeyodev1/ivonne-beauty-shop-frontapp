<script setup lang="ts">
import { site } from '@/config/site'

const channels = [
  {
    href: site.social.instagram,
    icon: 'fa-brands fa-instagram',
    label: 'Instagram',
    handle: '@ivonne.beautyshop',
    text: 'Novedades y swatches',
  },
  {
    href: site.social.tiktok,
    icon: 'fa-brands fa-tiktok',
    label: 'TikTok',
    handle: '@ivonnebeautyshop',
    text: 'Reseñas y lives de ofertas',
  },
  {
    href: site.whatsappCatalog,
    icon: 'fa-brands fa-whatsapp',
    label: 'Catálogo de WhatsApp',
    handle: site.whatsappDisplay,
    text: 'Todo el inventario en tu chat',
  },
  {
    href: site.canvaCatalog,
    icon: 'fa-solid fa-book-open',
    label: 'Catálogo en Canva',
    handle: 'Catálogo ilustrado',
    text: 'Para mirar con calma',
  },
].filter((c) => c.href)
</script>

<template>
  <section class="social" aria-labelledby="social-title">
    <p class="social__eyebrow">Síguenos</p>
    <h2 id="social-title" class="social__title">Lo nuevo sale primero en <em>redes</em></h2>
    <ul class="social__list">
      <li v-for="channel in channels" :key="channel.label">
        <a :href="channel.href" class="social__item" target="_blank" rel="noopener">
          <span class="social__icon"><i :class="channel.icon" aria-hidden="true"></i></span>
          <span class="social__body">
            <strong>{{ channel.label }}</strong>
            <small>{{ channel.handle }} · {{ channel.text }}</small>
          </span>
          <i class="fa-solid fa-arrow-up-right-from-square social__out" aria-hidden="true"></i>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.social {
  @include container(1180px);
  padding-block: $space-xl;
  text-align: center;

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.3rem;
  }

  &__title {
    @include display($display-sm);
    margin-bottom: 1.5rem;

    em {
      color: $accent;
    }
  }

  &__list {
    list-style: none;
    @include flex-cards(240px, 0.75rem);
    text-align: left;
  }

  &__item {
    @include flex(row, center, flex-start, 0.85rem);
    height: 100%;
    min-height: 72px;
    padding: 0.9rem 1rem;
    border-radius: $radius-md;
    background: $surface;
    border: 1px solid $line;
    @include transition;

    &:hover {
      border-color: $accent;
      box-shadow: $shadow-sm;

      .social__out {
        color: $accent;
      }
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-size: 1.15rem;
  }

  &__body {
    @include flex(column, flex-start, center);
    flex: 1;
    min-width: 0;

    strong {
      font-size: $text-sm;
      font-weight: 600;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__out {
    font-size: 0.75rem;
    color: $ink-muted;
    @include transition(color);
  }
}
</style>
