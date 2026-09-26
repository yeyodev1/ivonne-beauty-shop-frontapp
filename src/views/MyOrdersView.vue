<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { orderService } from '@/services/order.service'
import { useToastStore } from '@/stores/toast'
import OrderCard from '@/components/account/OrderCard.vue'
import type { ApiError, Order } from '@/types'

const toast = useToastStore()
const orders = ref<Order[]>([])
const loading = ref(true)
const failed = ref(false)

async function load() {
  loading.value = true
  failed.value = false
  try {
    orders.value = await orderService.mine()
  } catch (e) {
    failed.value = true
    toast.error((e as ApiError).message)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="orders">
    <RouterLink to="/cuenta" class="orders__back">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Mi cuenta
    </RouterLink>
    <p class="orders__eyebrow">Historial</p>
    <h1 class="orders__title">Mis <em>pedidos</em></h1>

    <div v-if="loading" class="orders__list" aria-busy="true" aria-label="Cargando pedidos">
      <div v-for="n in 3" :key="n" class="orders__skeleton"></div>
    </div>

    <div v-else-if="failed" class="orders__empty">
      <i class="fa-solid fa-cloud-exclamation" aria-hidden="true"></i>
      <p>No pudimos cargar tus pedidos.</p>
      <button type="button" class="btn btn--ghost" @click="load">Reintentar</button>
    </div>

    <div v-else-if="!orders.length" class="orders__empty">
      <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
      <h2>Aún no tienes pedidos</h2>
      <p>Cuando compres, aquí verás el estado de cada pedido.</p>
      <RouterLink to="/tienda" class="btn btn--primary">Ir a la tienda</RouterLink>
    </div>

    <TransitionGroup v-else tag="div" name="rise" class="orders__list" appear>
      <OrderCard v-for="order in orders" :key="order._id" :order="order" />
    </TransitionGroup>
  </section>
</template>

<style scoped lang="scss">
.orders {
  @include container(720px);
  padding-block: 1.5rem $space-xl;

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-height: 44px;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__eyebrow {
    @include eyebrow;
    margin-top: 0.4rem;
  }

  &__title {
    @include display($display-sm, 500);
    margin: 0.3rem 0 1.4rem;

    em {
      color: $accent;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  &__skeleton {
    height: 140px;
    border-radius: 14px;
    background: linear-gradient(90deg, $sand 0%, $paper 50%, $sand 100%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  &__empty {
    @include card;
    @include flex(column, center, flex-start, 0.7rem);
    text-align: center;
    padding: 2.4rem 1.2rem;
    color: $ink-soft;

    > i {
      font-size: 2rem;
      color: $accent;
    }

    h2 {
      font-size: $text-xl;
      color: $ink;
    }

    .btn {
      min-height: 48px;
      margin-top: 0.4rem;
    }
  }
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
