<script setup lang="ts">
import { useCheckout } from '@/composables/useCheckout'
import { useUserStore } from '@/stores/user'
import CheckoutStep from './CheckoutStep.vue'
import FormField from './FormField.vue'

const { form, errors, order, validateField } = useCheckout()
const userStore = useUserStore()

// Solo se valida al salir del campo si ya tiene algo: no regañar antes de tiempo.
function onBlur(key: 'name' | 'email' | 'phone' | 'documentId') {
  if (form[key].trim() || errors[key]) validateField(key)
}

const describedBy = (id: string) => (errors[id as keyof typeof errors] ? `${id}-error` : `${id}-hint`)
</script>

<template>
  <CheckoutStep :step="1" title="Tus datos" subtitle="Los pide Payphone para procesar tu pago de forma segura.">
    <p v-if="!userStore.isAuthenticated" class="customer__login">
      <i class="fa-regular fa-user" aria-hidden="true"></i>
      <span>
        Puedes comprar como invitada.
        <RouterLink :to="{ path: '/login', query: { next: '/checkout' } }">Inicia sesión</RouterLink>
        para ver tus pedidos luego.
      </span>
    </p>

    <fieldset class="customer__fields" :disabled="Boolean(order)">
      <legend class="visually-hidden">Datos de la compradora</legend>

      <FormField id="name" label="Nombre completo" :error="errors.name">
        <input
          id="name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          placeholder="Ej. María José Pérez"
          :aria-invalid="Boolean(errors.name)"
          :aria-describedby="describedBy('name')"
          @blur="onBlur('name')"
        />
      </FormField>

      <FormField id="email" label="Correo" :error="errors.email" hint="Aquí te llega la confirmación del pedido.">
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          inputmode="email"
          placeholder="tucorreo@gmail.com"
          :aria-invalid="Boolean(errors.email)"
          :aria-describedby="describedBy('email')"
          @blur="onBlur('email')"
        />
      </FormField>

      <div class="customer__row">
        <FormField id="phone" label="Celular" :error="errors.phone" hint="10 dígitos, empieza con 09.">
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel-national"
            inputmode="numeric"
            maxlength="10"
            placeholder="0991234567"
            :aria-invalid="Boolean(errors.phone)"
            :aria-describedby="describedBy('phone')"
            @blur="onBlur('phone')"
          />
        </FormField>

        <FormField id="documentId" label="Cédula o RUC" :error="errors.documentId" hint="10 o 13 dígitos.">
          <input
            id="documentId"
            v-model="form.documentId"
            type="text"
            inputmode="numeric"
            maxlength="13"
            placeholder="0701234567"
            :aria-invalid="Boolean(errors.documentId)"
            :aria-describedby="describedBy('documentId')"
            @blur="onBlur('documentId')"
          />
        </FormField>
      </div>
    </fieldset>
  </CheckoutStep>
</template>

<style scoped lang="scss">
.customer {
  &__login {
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $ink-soft;
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.7rem 0.85rem;
    margin-bottom: 1.1rem;

    i {
      color: $accent;
      margin-top: 0.25rem;
    }

    a {
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }

  &__fields {
    @include flex(column, stretch, flex-start, 1rem);
    border: 0;
    min-width: 0;

    &:disabled {
      opacity: 0.7;
    }
  }

  &__row {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('sm') {
      flex-direction: row;

      > * {
        flex: 1 1 0;
      }
    }
  }
}
</style>
