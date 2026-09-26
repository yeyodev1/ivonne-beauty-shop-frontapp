<script setup lang="ts">
import AdminOrderStatus from '@/components/admin/AdminOrderStatus.vue'
import AdminOrderCustomer from '@/components/admin/AdminOrderCustomer.vue'
import AdminOrderItems from '@/components/admin/AdminOrderItems.vue'
import AdminPayphoneBlock from '@/components/admin/AdminPayphoneBlock.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import { useAdminOrder } from '@/composables/useAdminOrder'
import { ORDER_STATUS_LABELS, formatDateTime, formatMoney } from '@/utils/format'

const { order, loading, status, updating, whatsapp, phone, payphoneJson, updateStatus, copyJson } = useAdminOrder()
</script>

<template>
  <section class="odetail">
    <AdminSkeleton v-if="loading" :rows="3" height="150px" />

    <AdminEmpty v-else-if="!order" icon="fa-solid fa-receipt" title="No encontramos este pedido">
      <RouterLink :to="{ name: 'AdminOrders' }" class="btn btn--primary">Volver a pedidos</RouterLink>
    </AdminEmpty>

    <template v-else>
      <header class="odetail__head">
        <div>
          <p class="odetail__number">{{ order.number }}</p>
          <p class="odetail__date">{{ formatDateTime(order.createdAt) }}</p>
        </div>
        <div class="odetail__right">
          <AdminOrderStatus :status="order.status" />
          <strong class="odetail__total">{{ formatMoney(order.total) }}</strong>
        </div>
      </header>

      <form class="odetail__status" @submit.prevent="updateStatus">
        <label for="order-status">Estado del pedido</label>
        <div class="odetail__status-row">
          <select id="order-status" v-model="status">
            <option v-for="(label, value) in ORDER_STATUS_LABELS" :key="value" :value="value">{{ label }}</option>
          </select>
          <button type="submit" class="btn btn--primary" :disabled="updating || status === order.status">
            {{ updating ? 'Guardando…' : 'Actualizar estado' }}
          </button>
        </div>
        <small v-if="status === 'shipped' || status === 'delivered'">
          La clienta recibirá un correo con el nuevo estado.
        </small>
      </form>

      <div class="odetail__cols">
        <AdminOrderCustomer :order="order" :whatsapp="whatsapp" :phone="phone" />
        <AdminOrderItems :order="order" />
      </div>

      <AdminPayphoneBlock :json="payphoneJson" :transaction-id="order.clientTransactionId" @copy="copyJson" />
    </template>
  </section>
</template>

<style scoped lang="scss">
.odetail {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__head {
    @include flex(row, flex-start, space-between, 0.8rem);
  }

  &__number {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  &__date {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__right {
    @include flex(column, flex-end, flex-start, 0.35rem);
  }

  &__total {
    font-size: 1.1rem;
    font-variant-numeric: tabular-nums;
  }

  &__status {
    @include card;
    padding: 1rem;
    background: $sand;
    border-color: $blush;

    small {
      display: block;
      margin-top: 0.5rem;
      font-size: $text-xs;
      color: $ink-soft;
    }
  }

  &__status-row {
    @include flex(column, stretch, flex-start, 0.5rem);

    @include from('sm') {
      flex-direction: row;
    }

    select {
      min-height: 48px;
      font-size: 1rem;
    }

    .btn {
      flex: 0 0 auto;
      min-height: 48px;
    }
  }

  &__cols {
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;

      > * {
        flex: 1 1 0;
        min-width: 0;
      }
    }
  }
}
</style>
