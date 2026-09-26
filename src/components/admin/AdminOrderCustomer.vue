<script setup lang="ts">
import type { Order } from '@/types'

defineProps<{ order: Order; whatsapp: string; phone: string }>()
</script>

<template>
  <section class="ocust">
    <h2 class="ocust__title">Clienta</h2>
    <p class="ocust__name">{{ order.customer.name }}</p>
    <ul class="ocust__data">
      <li><i class="fa-regular fa-envelope" aria-hidden="true"></i><a :href="`mailto:${order.customer.email}`">{{ order.customer.email }}</a></li>
      <li v-if="order.customer.phone"><i class="fa-solid fa-mobile-screen" aria-hidden="true"></i>{{ order.customer.phone }}</li>
      <li v-if="order.customer.documentId"><i class="fa-regular fa-id-card" aria-hidden="true"></i>Cédula/RUC {{ order.customer.documentId }}</li>
    </ul>
    <div v-if="whatsapp || phone" class="ocust__actions">
      <a v-if="whatsapp" :href="whatsapp" target="_blank" rel="noopener" class="btn ocust__wa">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
      </a>
      <a v-if="phone" :href="phone" class="btn btn--ghost">
        <i class="fa-solid fa-phone" aria-hidden="true"></i> Llamar
      </a>
    </div>

    <h2 class="ocust__title ocust__title--gap">Entrega</h2>
    <p class="ocust__ship"><i class="fa-solid fa-truck" aria-hidden="true"></i>{{ order.shipping.label }}</p>
    <p v-if="order.address.street" class="ocust__addr">
      {{ order.address.street }}<br />
      <span v-if="order.address.reference">Ref.: {{ order.address.reference }}<br /></span>
      {{ order.address.city }}
    </p>
    <p v-else-if="order.address.city" class="ocust__addr">{{ order.address.city }}</p>
    <p v-if="order.notes" class="ocust__notes"><strong>Nota:</strong> {{ order.notes }}</p>
  </section>
</template>

<style scoped lang="scss">
.ocust {
  @include card;
  padding: 1rem;

  &__title {
    @include eyebrow;
    margin-bottom: 0.4rem;

    &--gap {
      margin-top: 1.2rem;
    }
  }

  &__name {
    font-weight: 700;
    font-size: 1.05rem;
  }

  &__data {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.25rem);
    margin-top: 0.3rem;
    font-size: $text-sm;
    color: $ink-soft;

    li {
      @include flex(row, center, flex-start, 0.55rem);
      min-width: 0;
      overflow-wrap: anywhere;
    }

    i {
      width: 16px;
      color: $ink-muted;
    }

    a {
      text-decoration: underline;
      text-decoration-color: $blush;
    }
  }

  &__actions {
    @include flex(row, stretch, flex-start, 0.5rem);
    margin-top: 0.9rem;

    .btn {
      flex: 1 1 0;
      min-height: 46px;
      padding-inline: 0.8rem;
    }
  }

  &__wa {
    background: #25d366;
    color: $surface;
  }

  &__ship {
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 600;
    font-size: 0.92rem;

    i {
      color: $accent;
    }
  }

  &__addr {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__notes {
    margin-top: 0.7rem;
    font-size: $text-sm;
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.7rem 0.8rem;
  }
}
</style>
