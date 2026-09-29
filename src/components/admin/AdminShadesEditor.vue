<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import AdminStockStepper from './AdminStockStepper.vue'
import AdminSwitch from './AdminSwitch.vue'
import type { ProductShade } from '@/types'

const shades = defineModel<ProductShade[]>({ required: true })

const draft = ref('')
const draftInput = ref<HTMLInputElement | null>(null)
const error = ref('')

const summary = computed(() => {
  const list = shades.value
  const available = list.filter((s) => s.isActive && s.stock > 0).length
  const units = list.reduce((sum, s) => sum + (s.isActive ? s.stock : 0), 0)
  return `${list.length} ${list.length === 1 ? 'tono' : 'tonos'} · ${available} a la venta · ${units} unidades`
})

// Enter agrega y deja el cursor listo para el siguiente: cargar 10 tonos es escribir y dar Enter.
async function add() {
  const name = draft.value.trim()
  if (!name) return
  if (shades.value.some((s) => s.name.trim().toLowerCase() === name.toLowerCase())) {
    error.value = `Ya existe el tono "${name}"`
    return
  }
  error.value = ''
  shades.value.push({ name, color: '', stock: 1, isActive: true })
  draft.value = ''
  await nextTick()
  draftInput.value?.focus()
}

function remove(index: number) {
  shades.value.splice(index, 1)
}

function status(shade: ProductShade): string {
  if (!shade.isActive) return 'Bloqueado'
  if (shade.stock <= 0) return 'Sin stock'
  return ''
}
</script>

<template>
  <div class="shades">
    <p v-if="shades.length" class="shades__summary">{{ summary }}</p>

    <ul v-if="shades.length" class="shades__list">
      <li
        v-for="(shade, i) in shades"
        :key="shade._id || `nuevo-${i}`"
        class="shades__row"
        :class="{ 'shades__row--off': !shade.isActive }"
      >
        <div class="shades__head">
          <label class="shades__swatch" :title="shade.color ? 'Cambiar color' : 'Elegir color'">
            <span class="visually-hidden">Color del tono {{ shade.name }}</span>
            <input v-model="shade.color" type="color" class="shades__color" />
            <span
              class="shades__chip"
              :class="{ 'shades__chip--empty': !shade.color }"
              :style="shade.color ? { backgroundColor: shade.color } : undefined"
              aria-hidden="true"
            >
              <i v-if="!shade.color" class="fa-solid fa-eye-dropper"></i>
            </span>
          </label>
          <input
            v-model="shade.name"
            type="text"
            class="shades__name"
            placeholder="Nombre del tono"
            :aria-label="`Nombre del tono ${i + 1}`"
            maxlength="60"
          />
          <button
            type="button"
            class="shades__delete"
            :aria-label="`Quitar el tono ${shade.name}`"
            @click="remove(i)"
          >
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
        <div class="shades__controls">
          <AdminStockStepper :id="`shade-stock-${i}`" v-model="shade.stock" label="Stock" />
          <AdminSwitch
            :id="`shade-active-${i}`"
            v-model="shade.isActive"
            label="A la venta"
            :hint="status(shade) || 'Tus clientas lo pueden elegir'"
          />
        </div>
      </li>
    </ul>

    <div class="shades__add">
      <input
        ref="draftInput"
        v-model="draft"
        type="text"
        placeholder="Ej: 120 Light Neutral"
        aria-label="Nombre del nuevo tono"
        maxlength="60"
        @keydown.enter.prevent="add"
      />
      <button type="button" class="btn btn--ghost shades__add-btn" :disabled="!draft.trim()" @click="add">
        <i class="fa-solid fa-plus" aria-hidden="true"></i> Agregar tono
      </button>
    </div>
    <small v-if="error" class="shades__error">{{ error }}</small>
  </div>
</template>

<style scoped lang="scss">
.shades {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__summary {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__row {
    @include flex(column, stretch, flex-start, 0.5rem);
    padding: 0.75rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    @include transition(background);

    &--off {
      background: $sand;

      .shades__name {
        text-decoration: line-through;
        color: $ink-muted;
      }
    }
  }

  &__head {
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__swatch {
    position: relative;
    flex: 0 0 46px;
    height: 46px;
    margin: 0;
    cursor: pointer;
  }

  // El input nativo queda encima e invisible: se ve la muestra redonda, abre el selector del sistema
  &__color {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  &__chip {
    @include flex(row, center, center);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba($ink, 0.15);
    pointer-events: none;

    &--empty {
      background: $sand;
      color: $ink-muted;
      font-size: 0.85rem;
      border: 1px dashed $line;
      box-shadow: none;
    }
  }

  &__color:focus-visible + &__chip {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &__name {
    flex: 1 1 auto;
    min-width: 0;
    font-weight: 600;
  }

  &__delete {
    flex: 0 0 44px;
    height: 44px;
    color: $ink-muted;
    @include focus-ring;

    &:hover {
      color: $danger;
    }
  }

  &__controls {
    @include flex(column, stretch, flex-start, 0.4rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      gap: 1.5rem;

      > :last-child {
        flex: 1;
      }
    }
  }

  &__add {
    @include flex(row, stretch, flex-start, 0.5rem);

    input {
      flex: 1 1 auto;
      min-width: 0;
    }
  }

  &__add-btn {
    flex-shrink: 0;
    min-height: 46px;
    white-space: nowrap;
  }

  &__error {
    color: $danger;
    font-size: $text-xs;
  }
}
</style>
