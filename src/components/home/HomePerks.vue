<script setup lang="ts">
import { site } from '@/config/site'
</script>

<template>
  <ul class="perks" aria-label="Por qué comprar con nosotras">
    <li v-for="perk in site.perks" :key="perk.title" class="perks__item">
      <span class="perks__icon"><i :class="perk.icon" aria-hidden="true"></i></span>
      <div>
        <strong class="perks__title">{{ perk.title }}</strong>
        <p class="perks__text">{{ perk.text }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.perks {
  @include container(1180px);
  @include flex-cards(150px, 1.1rem);
  list-style: none;
  padding-block: 3rem 1rem;

  @include from('md') {
    > * {
      flex-basis: 200px;
    }
  }

  &__item {
    @include flex(column, flex-start, flex-start, 0.55rem);

    @include from('md') {
      flex-direction: row;
      gap: 0.8rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    background: $blush;
    color: $accent-deep;
    font-size: 0.95rem;
  }

  &__title {
    display: block;
    font-size: $text-sm;
    font-weight: 600;
  }

  &__text {
    font-size: $text-xs;
    color: $ink-soft;
    line-height: 1.5;
  }
}
</style>
