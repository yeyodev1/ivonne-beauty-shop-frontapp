<script setup lang="ts">
import { useCheckout } from '@/composables/useCheckout'
import { formatMoney } from '@/utils/format'
import { site } from '@/config/site'
import CheckoutStep from './CheckoutStep.vue'
import FormField from './FormField.vue'

const {
  form,
  errors,
  order,
  shippingOptions,
  shippingId,
  isPickup,
  loadingSettings,
  settingsError,
  loadSettings,
  validateField,
} = useCheckout()

function onBlur(key: 'city' | 'street') {
  if (form[key].trim() || errors[key]) validateField(key)
}
</script>

<template>
  <CheckoutStep :step="2" title="Entrega" subtitle="Elige cómo quieres recibir tus productos.">
    <fieldset class="delivery" :disabled="Boolean(order)">
      <legend class="visually-hidden">Forma de entrega</legend>

      <div v-if="loadingSettings" class="delivery__options" aria-busy="true">
        <div v-for="n in 3" :key="n" class="delivery__skeleton"></div>
      </div>

      <div v-else-if="settingsError" class="delivery__error" role="alert">
        <p>{{ settingsError }}</p>
        <button type="button" class="btn btn--ghost" @click="loadSettings">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reintentar
        </button>
      </div>

      <div v-else class="delivery__options" role="radiogroup" aria-label="Opciones de entrega">
        <label
          v-for="option in shippingOptions"
          :key="option.id"
          class="delivery__option"
          :class="{ 'delivery__option--active': shippingId === option.id }"
        >
          <input v-model="shippingId" class="visually-hidden" type="radio" name="shipping" :value="option.id" />
          <span class="delivery__radio" aria-hidden="true"></span>
          <span class="delivery__text">
            <strong>{{ option.label }}</strong>
            <small v-if="option.description">{{ option.description }}</small>
          </span>
          <span class="delivery__price" :class="{ 'delivery__price--free': !option.price }">
            {{ option.price ? formatMoney(option.price) : 'Gratis' }}
          </span>
        </label>
      </div>
      <p v-if="errors.shipping" class="delivery__warn" role="alert">{{ errors.shipping }}</p>

      <Transition name="fade" mode="out-in">
        <div v-if="isPickup" key="pickup" class="delivery__store">
          <i class="fa-solid fa-store" aria-hidden="true"></i>
          <div>
            <strong>Te esperamos en la tienda</strong>
            <p>{{ site.address.street }} · {{ site.address.reference }}</p>
            <p>{{ site.address.city }}</p>
            <a :href="site.address.mapsUrl" target="_blank" rel="noopener">Ver en el mapa</a>
          </div>
        </div>

        <div v-else-if="shippingId" key="address" class="delivery__address">
          <FormField id="city" label="Ciudad" :error="errors.city">
            <input
              id="city"
              v-model="form.city"
              type="text"
              autocomplete="address-level2"
              :aria-invalid="Boolean(errors.city)"
              @blur="onBlur('city')"
            />
          </FormField>
          <FormField id="street" label="Dirección" :error="errors.street">
            <input
              id="street"
              v-model="form.street"
              type="text"
              autocomplete="street-address"
              placeholder="Calle principal, número y calle secundaria"
              :aria-invalid="Boolean(errors.street)"
              @blur="onBlur('street')"
            />
          </FormField>
          <FormField id="reference" label="Referencia (opcional)">
            <input id="reference" v-model="form.reference" type="text" placeholder="Casa esquinera, portón rosado…" />
          </FormField>
        </div>
      </Transition>

      <FormField id="notes" label="Notas para la tienda (opcional)">
        <textarea id="notes" v-model="form.notes" rows="2" maxlength="500" placeholder="¿Es un regalo? Cuéntanos"></textarea>
      </FormField>
    </fieldset>
  </CheckoutStep>
</template>

<style scoped lang="scss">
.delivery {
  @include flex(column, stretch, flex-start, 1rem);
  border: 0;
  min-width: 0;

  &:disabled {
    opacity: 0.7;
  }

  &__options {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__skeleton {
    height: 64px;
    border-radius: $radius-sm;
    background: linear-gradient(90deg, $sand 0%, $paper 50%, $sand 100%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  &__option {
    @include flex(row, center, flex-start, 0.8rem);
    min-height: 64px;
    margin: 0;
    padding: 0.8rem 0.9rem;
    border: 1.5px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    color: $ink;
    cursor: pointer;
    transition: border-color 0.25s ease, background 0.25s ease;

    &:focus-within {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--active {
      border-color: $accent;
      background: rgba($accent, 0.04);
    }
  }

  &__radio {
    flex: 0 0 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid $ink-muted;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;

    .delivery__option--active & {
      border-color: $accent;
      box-shadow: inset 0 0 0 4px $surface, inset 0 0 0 10px $accent;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;

    strong {
      font-size: $text-sm;
      font-weight: 600;
    }

    small {
      font-size: $text-xs;
      color: $ink-soft;
      font-weight: 400;
      line-height: 1.4;
    }
  }

  &__price {
    font-weight: 700;
    font-size: $text-sm;
    white-space: nowrap;

    &--free {
      color: $accent-deep;
    }
  }

  &__warn {
    font-size: $text-xs;
    color: $danger;
  }

  &__error {
    @include flex(column, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $danger;
  }

  &__store {
    @include flex(row, flex-start, flex-start, 0.8rem);
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.9rem 1rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
      margin-top: 0.2rem;
    }

    strong {
      color: $ink;
    }

    a {
      display: inline-block;
      margin-top: 0.3rem;
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }

  &__address {
    @include flex(column, stretch, flex-start, 1rem);
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
