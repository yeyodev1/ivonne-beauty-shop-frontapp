<script setup lang="ts">
const props = withDefaults(
  defineProps<{ modelValue: number; max: number; min?: number; label?: string; size?: 'sm' | 'md' }>(),
  { min: 1, label: 'Cantidad', size: 'md' },
)
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function set(value: number) {
  emit('update:modelValue', Math.max(props.min, Math.min(props.max, value)))
}
</script>

<template>
  <div class="stepper" :class="`stepper--${size}`" role="group" :aria-label="label">
    <button
      type="button"
      class="stepper__btn"
      :disabled="modelValue <= min"
      aria-label="Quitar una unidad"
      @click="set(modelValue - 1)"
    >
      <i class="fa-solid fa-minus"></i>
    </button>
    <span class="stepper__value" aria-live="polite">{{ modelValue }}</span>
    <button
      type="button"
      class="stepper__btn"
      :disabled="modelValue >= max"
      aria-label="Agregar una unidad"
      @click="set(modelValue + 1)"
    >
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  @include flex(row, center, space-between);
  border: 1px solid $line;
  border-radius: $radius-pill;
  background: $surface;
  flex-shrink: 0;

  &__btn {
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 0.75rem;
    color: $ink;
    @include focus-ring;

    &:hover:not(:disabled) {
      color: $accent;
    }

    &:disabled {
      color: $ink-muted;
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__value {
    min-width: 1.6rem;
    text-align: center;
    font-weight: 600;
    font-size: $text-sm;
    font-variant-numeric: tabular-nums;
  }

  &--md &__btn {
    width: 48px;
    height: 48px;
  }
}
</style>
