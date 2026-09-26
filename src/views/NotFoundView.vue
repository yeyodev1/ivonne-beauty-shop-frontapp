<script setup lang="ts">
import { whatsappLink } from '@/config/site'
</script>

<template>
  <section class="not-found">
    <span class="not-found__mirror" aria-hidden="true">
      <span class="not-found__code">404</span>
    </span>
    <h1 class="not-found__title">Uy, bella, esta página <em>no existe</em></h1>
    <p class="not-found__text">
      Puede que el enlace esté mal escrito o que la página se haya movido. Tus favoritos siguen en la
      tienda.
    </p>
    <div class="not-found__actions">
      <RouterLink to="/tienda" class="btn btn--primary">Ir a la tienda</RouterLink>
      <a :href="whatsappLink()" class="btn btn--ghost" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp"></i> Escríbenos
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @include container(640px);
  @include flex(column, center, center, 0.9rem);
  flex: 1;
  text-align: center;
  padding-block: $space-xl;

  &__mirror {
    @include flex(row, center, center);
    width: 130px;
    height: 170px;
    border-radius: 999px 999px $radius-md $radius-md;
    background: $sand;
    border: 5px solid $surface;
    box-shadow: $shadow-md;
    margin-bottom: 0.6rem;
  }

  &__code {
    font-family: $font-display;
    font-style: italic;
    font-size: 2.6rem;
    color: $accent;
  }

  &__title {
    @include display($display-md);

    em {
      color: $accent;
    }
  }

  &__text {
    color: $ink-soft;
    max-width: 42ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }
}
</style>
