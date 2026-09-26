<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
</script>

<template>
  <section id="visitanos" class="visit">
    <div class="visit__card">
      <div class="visit__copy">
        <p class="visit__eyebrow">{{ site.about.eyebrow }}</p>
        <h2 class="visit__title">Visítanos en <em>Machala</em></h2>
        <p class="visit__text">{{ site.about.text }}</p>
      </div>

      <div class="visit__info">
        <p class="visit__row">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          <span>
            <strong>{{ site.address.street }}</strong>
            {{ site.address.reference }} · {{ site.address.city }}
          </span>
        </p>
        <p class="visit__row">
          <i class="fa-regular fa-clock" aria-hidden="true"></i>
          <span>{{ site.about.hours }}</span>
        </p>
        <p class="visit__row">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          <span>{{ site.whatsappDisplay }}</span>
        </p>
        <div class="visit__actions">
          <a :href="site.address.mapsUrl" class="btn btn--primary" target="_blank" rel="noopener">
            <i class="fa-solid fa-diamond-turn-right"></i> Cómo llegar
          </a>
          <a :href="whatsappLink()" class="btn btn--ghost" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp"></i> Escríbenos
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.visit {
  @include container(1180px);
  padding-top: $space-xl;
  scroll-margin-top: 5rem;

  &__card {
    @include flex(column, stretch, flex-start, 1.75rem);
    background: $sand;
    border-radius: $radius-lg;
    padding: 2rem 1.25rem;
    position: relative;
    overflow: hidden;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 3rem;
      padding: 3.25rem;
    }

    // Arco de espejo de tocador de fondo, en blush
    &::before {
      content: '';
      position: absolute;
      right: -60px;
      top: -40px;
      width: 220px;
      height: 300px;
      border-radius: 999px 999px 0 0;
      border: 2px solid $blush;
      pointer-events: none;
    }
  }

  &__copy,
  &__info {
    position: relative;

    @include from('md') {
      flex: 1 1 50%;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.4rem;
  }

  &__title {
    @include display($display-md);
    margin-bottom: 0.8rem;

    em {
      color: $accent;
    }
  }

  &__text {
    color: $ink-soft;
    max-width: 44ch;
  }

  &__info {
    @include flex(column, stretch, flex-start, 0.8rem);
    background: $surface;
    border-radius: $radius-md;
    padding: 1.4rem 1.25rem;
  }

  &__row {
    @include flex(row, flex-start, flex-start, 0.8rem);
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
      width: 1.1rem;
      margin-top: 0.3rem;
      text-align: center;
    }

    strong {
      display: block;
      color: $ink;
      font-weight: 600;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;

    .btn {
      flex: 1 1 150px;
      min-height: 48px;
    }
  }
}
</style>
