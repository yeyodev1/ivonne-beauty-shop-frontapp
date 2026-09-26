<script setup lang="ts">
import AdminSwitch from './AdminSwitch.vue'
import type { ShippingDraft } from '@/composables/useAdminSettings'

defineProps<{ option: ShippingDraft }>()
</script>

<template>
  <fieldset class="ship" :class="{ 'ship--off': !option.enabled }">
    <legend class="visually-hidden">Envío {{ option.label }}</legend>
    <AdminSwitch
      :id="`ship-${option.id}-enabled`"
      v-model="option.enabled"
      :label="option.label || option.id"
      :hint="option.enabled ? 'Se ofrece en el checkout' : 'No se muestra a las clientas'"
    />
    <div class="ship__fields">
      <div class="ship__label">
        <label :for="`ship-${option.id}-label`">Nombre</label>
        <input :id="`ship-${option.id}-label`" v-model="option.label" type="text" />
      </div>
      <div class="ship__price">
        <label :for="`ship-${option.id}-price`">Precio</label>
        <div class="ship__money">
          <span aria-hidden="true">$</span>
          <input :id="`ship-${option.id}-price`" v-model="option.price" type="text" inputmode="decimal" placeholder="0.00" />
        </div>
      </div>
    </div>
    <div>
      <label :for="`ship-${option.id}-desc`">Descripción</label>
      <input :id="`ship-${option.id}-desc`" v-model="option.description" type="text" placeholder="Ej: Entrega en 24 a 48 horas" />
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.ship {
  border: 1px solid $line;
  border-radius: 14px;
  padding: 0.4rem 0.9rem 0.9rem;
  @include flex(column, stretch, flex-start, 0.6rem);
  min-width: 0;
  @include transition(opacity);

  &--off {
    background: $paper;
  }

  input {
    font-size: 1rem;
    min-height: 46px;
  }

  &__fields {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('sm') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__label {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__price {
    flex: 0 0 auto;
    max-width: 160px;

    @include from('sm') {
      flex-basis: 130px;
    }
  }

  &__money {
    position: relative;

    span {
      position: absolute;
      left: 0.8rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-weight: 600;
    }

    input {
      padding-left: 1.6rem;
    }
  }
}
</style>
