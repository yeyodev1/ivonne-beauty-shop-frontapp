<script setup lang="ts">
defineProps<{ id: string; label: string }>()

const model = defineModel<number>({ required: true })

function set(value: number) {
  model.value = Math.max(0, Math.round(Number.isFinite(value) ? value : 0))
}
</script>

<template>
  <div class="stepper">
    <label :for="id">{{ label }}</label>
    <div class="stepper__box">
      <button type="button" class="stepper__btn" aria-label="Restar uno" :disabled="model <= 0" @click="set(model - 1)">
        <i class="fa-solid fa-minus"></i>
      </button>
      <input
        :id="id"
        :value="model"
        type="number"
        inputmode="numeric"
        min="0"
        class="stepper__input"
        @change="set(Number(($event.target as HTMLInputElement).value))"
      />
      <button type="button" class="stepper__btn" aria-label="Sumar uno" @click="set(model + 1)">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  &__box {
    @include flex(row, stretch, flex-start);
    border: 1px solid $line;
    border-radius: $radius-sm;
    overflow: hidden;
    max-width: 220px;
    background: $surface;
  }

  &__btn {
    flex: 0 0 52px;
    min-height: 48px;
    color: $accent;
    background: $sand;
    @include focus-ring;

    &:disabled {
      color: $ink-muted;
    }
  }

  &__input {
    flex: 1 1 auto;
    min-width: 0;
    border: none;
    border-radius: 0;
    text-align: center;
    font-weight: 700;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    &:focus {
      box-shadow: inset 0 0 0 2px rgba($accent, 0.3);
    }
  }
}
</style>
