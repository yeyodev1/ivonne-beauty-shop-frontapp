<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; accent?: string; link?: string; linkLabel?: string }>()
</script>

<template>
  <section class="section">
    <header class="section__head">
      <div>
        <p class="section__eyebrow">{{ eyebrow }}</p>
        <h2 class="section__title">
          {{ title }} <em v-if="accent">{{ accent }}</em>
        </h2>
      </div>
      <RouterLink v-if="link" :to="link" class="section__link">
        {{ linkLabel || 'Ver todo' }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </header>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.section {
  @include container(1180px);
  padding-top: $space-xl;

  &__head {
    @include flex(row, flex-end, space-between, 1rem);
    margin-bottom: 1.25rem;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.3rem;
  }

  &__title {
    @include display($display-sm);

    em {
      color: $accent;
    }
  }

  &__link {
    @include flex(row, center, center, 0.4rem);
    flex-shrink: 0;
    min-height: 44px;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $accent-deep;

    i {
      @include transition(transform);
    }

    &:hover i {
      transform: translateX(3px);
    }
  }
}
</style>
