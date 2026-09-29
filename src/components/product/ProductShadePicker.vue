<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import type { ProductShade } from '@/types'

const props = defineProps<{ shades: ProductShade[] }>()
const model = defineModel<string>({ required: true })

const copy = site.shades

// Solo muestras de color si todos los tonos tienen color; si no, chips con nombre.
const swatches = computed(() => props.shades.every((s) => s.color))
const selected = computed(() => props.shades.find((s) => s._id === model.value) || null)

function available(shade: ProductShade): boolean {
  return shade.isActive && shade.stock > 0
}

function pick(shade: ProductShade) {
  if (available(shade) && shade._id) model.value = shade._id
}
</script>

<template>
  <fieldset id="tonos" class="shades">
    <legend class="shades__legend">
      <span class="shades__label">{{ copy.label }}:</span>
      <strong v-if="selected" class="shades__current">{{ selected.name }}</strong>
      <span v-else class="shades__hint">{{ copy.choose }}</span>
    </legend>

    <div class="shades__list" :class="{ 'shades__list--chips': !swatches }" role="radiogroup">
      <button
        v-for="shade in shades"
        :key="shade._id || shade.name"
        type="button"
        role="radio"
        class="shades__option"
        :class="{
          'shades__option--active': shade._id === model,
          'shades__option--out': !available(shade),
        }"
        :aria-checked="shade._id === model"
        :aria-disabled="!available(shade)"
        :aria-label="available(shade) ? shade.name : `${shade.name}, ${copy.soldOut}`"
        :title="available(shade) ? shade.name : `${shade.name} (${copy.soldOut})`"
        @click="pick(shade)"
      >
        <span
          v-if="shade.color"
          class="shades__dot"
          :style="{ backgroundColor: shade.color }"
          aria-hidden="true"
        ></span>
        <span v-if="!swatches" class="shades__name">{{ shade.name }}</span>
      </button>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.shades {
  border: none;
  padding: 0;
  margin: 0.2rem 0 0;
  min-width: 0;
  scroll-margin-top: 7rem;

  &__legend {
    @include flex(row, baseline, flex-start, 0.4rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    margin-bottom: 0.7rem;
    padding: 0;
  }

  &__label {
    color: $ink-soft;
  }

  &__current {
    font-weight: 600;
  }

  &__hint {
    color: $accent-deep;
    font-weight: 500;
  }

  &__list {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  // Muestra circular: 44px de área táctil con el color adentro y aro al elegirla
  &__option {
    position: relative;
    @include flex(row, center, center, 0.45rem);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid transparent;
    @include transition(border-color);
    @include focus-ring;

    &:hover:not(.shades__option--out) {
      border-color: $line;
    }

    &--active,
    &--active:hover:not(.shades__option--out) {
      border-color: $ink;
    }

    &--out {
      cursor: not-allowed;

      .shades__dot {
        opacity: 0.45;
      }

      // Línea diagonal: se lee como "no disponible" sin depender del color
      &::after {
        content: '';
        position: absolute;
        width: 70%;
        height: 2px;
        background: $ink-muted;
        transform: rotate(-45deg);
        border-radius: 2px;
      }
    }
  }

  &__dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba($ink, 0.12);
  }

  &__list--chips &__option {
    width: auto;
    height: auto;
    min-height: 44px;
    padding: 0.35rem 0.9rem 0.35rem 0.5rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-sm;

    &--active,
    &--active:hover:not(.shades__option--out) {
      border-color: $ink;
      box-shadow: inset 0 0 0 1px $ink;
    }

    &--out {
      color: $ink-muted;
      background: $sand;

      &::after {
        display: none;
      }

      .shades__name {
        text-decoration: line-through;
      }
    }
  }

  &__list--chips &__dot {
    width: 22px;
    height: 22px;
  }

  &__list--chips &__option:not(:has(.shades__dot)) {
    padding-left: 0.9rem;
  }
}
</style>
