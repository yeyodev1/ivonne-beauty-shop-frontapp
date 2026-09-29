<script setup lang="ts">
import { computed } from 'vue'
import { itemKey, useCartStore } from '@/stores/cart'
import CartLine from '@/components/cart/CartLine.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import CartEmpty from '@/components/cart/CartEmpty.vue'

const cart = useCartStore()
const countLabel = computed(() => (cart.count === 1 ? '1 producto' : `${cart.count} productos`))
</script>

<template>
  <div class="cart">
    <header class="cart__head">
      <p class="cart__eyebrow">Carrito</p>
      <h1 class="cart__title">Tu <em>bolsa</em></h1>
      <p v-if="!cart.isEmpty" class="cart__count">{{ countLabel }}</p>
    </header>

    <CartEmpty v-if="cart.isEmpty" class="cart__empty" />

    <div v-else class="cart__body">
      <section class="cart__lines" aria-label="Productos en tu bolsa">
        <ul>
          <CartLine v-for="item in cart.items" :key="itemKey(item)" :item="item" />
        </ul>
        <div class="cart__more">
          <RouterLink to="/tienda" class="cart__continue">
            <i class="fa-solid fa-arrow-left"></i> Seguir comprando
          </RouterLink>
          <button type="button" class="cart__clear" @click="cart.clear()">Vaciar bolsa</button>
        </div>
      </section>

      <aside class="cart__aside">
        <h2 class="cart__aside-title">Resumen</h2>
        <CartSummary />
        <p class="cart__trust">
          <i class="fa-solid fa-certificate" aria-hidden="true"></i>
          Productos 100% originales traídos de USA
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart {
  @include container(1100px);
  padding-block: $space-md $space-xl;

  &__head {
    padding-block: 0.5rem 1.25rem;
    border-bottom: 1px solid $line;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);

    em {
      color: $accent;
    }
  }

  &__count {
    font-size: $text-sm;
    color: $ink-muted;
    margin-top: 0.3rem;
  }

  &__empty {
    padding-block: $space-xl;
  }

  &__body {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3rem;
    }
  }

  &__lines {
    flex: 1;
    min-width: 0;

    ul {
      list-style: none;
    }
  }

  &__more {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-top: 1rem;
    font-size: $text-sm;
  }

  &__continue,
  &__clear {
    @include flex(row, center, center, 0.45rem);
    min-height: 44px;
    font-weight: 600;
    color: $ink-soft;

    &:hover {
      color: $accent-deep;
    }
  }

  &__clear {
    font-size: $text-xs;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__aside {
    @include flex(column, stretch, flex-start, 1rem);
    background: $sand;
    border-radius: $radius-lg;
    padding: 1.5rem 1.25rem;

    @include from('lg') {
      flex: 0 0 360px;
      position: sticky;
      top: 6.5rem;
      margin-top: 1rem;
      padding: 1.75rem;
    }
  }

  &__aside-title {
    @include display($text-xl, 500);
    font-style: italic;
  }

  &__trust {
    @include flex(row, center, center, 0.45rem);
    font-size: $text-xs;
    color: $ink-soft;
    text-align: center;

    i {
      color: $accent;
    }
  }
}
</style>
