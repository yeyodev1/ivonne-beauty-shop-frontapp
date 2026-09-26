<script setup lang="ts">
import { formatMoney } from '@/utils/format'
import type { ShippingOption } from '@/types'

defineProps<{ description: string; shipping: ShippingOption[] }>()
</script>

<template>
  <div class="details">
    <section v-if="description" class="details__block">
      <h2 class="details__title">Descripción</h2>
      <p class="details__text">{{ description }}</p>
    </section>

    <section v-if="shipping.length" class="details__block">
      <h2 class="details__title">Envíos</h2>
      <ul class="details__ship">
        <li v-for="option in shipping" :key="option.id" class="details__ship-item">
          <div>
            <strong>{{ option.label }}</strong>
            <small v-if="option.description">{{ option.description }}</small>
          </div>
          <span class="details__ship-price">
            {{ option.price ? formatMoney(option.price) : 'Gratis' }}
          </span>
        </li>
      </ul>
    </section>

    <section class="details__original">
      <i class="fa-solid fa-certificate" aria-hidden="true"></i>
      <div>
        <strong>100% original</strong>
        <p>Traído de USA con su empaque de fábrica. Nada de réplicas.</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.details {
  @include flex(column, stretch, flex-start, 1.5rem);

  &__block {
    padding-top: 1.25rem;
    border-top: 1px solid $line;
  }

  &__title {
    @include eyebrow;
    margin-bottom: 0.6rem;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
    white-space: pre-line;
  }

  &__ship {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__ship-item {
    @include flex(row, center, space-between, 1rem);
    font-size: $text-sm;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    background: $surface;
    border: 1px solid $line;

    small {
      display: block;
      color: $ink-muted;
      font-size: $text-xs;
      line-height: 1.4;
    }
  }

  &__ship-price {
    font-weight: 600;
    white-space: nowrap;
  }

  &__original {
    @include flex(row, flex-start, flex-start, 0.8rem);
    background: $sand;
    border-radius: $radius-md;
    padding: 1rem 1.1rem;
    font-size: $text-sm;

    i {
      color: $accent;
      font-size: 1.3rem;
      margin-top: 0.15rem;
    }

    p {
      color: $ink-soft;
      font-size: $text-xs;
    }
  }
}
</style>
