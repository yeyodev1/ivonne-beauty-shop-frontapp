<script setup lang="ts">
defineProps<{ label: string; hint?: string; id: string }>()

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="switch" :for="id">
    <span class="switch__text">
      <span class="switch__label">{{ label }}</span>
      <span v-if="hint" class="switch__hint">{{ hint }}</span>
    </span>
    <input :id="id" v-model="model" type="checkbox" role="switch" class="switch__input" />
    <span class="switch__track" aria-hidden="true"></span>
  </label>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, center, space-between, 1rem);
  min-height: 48px;
  margin: 0;
  cursor: pointer;
  position: relative;

  &__text {
    @include flex(column, flex-start, center, 0.1rem);
  }

  &__label {
    font-size: 0.9rem;
    font-weight: 600;
    color: $ink;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
    font-weight: 400;
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  &__track {
    flex: 0 0 48px;
    height: 28px;
    border-radius: $radius-pill;
    background: $line;
    position: relative;
    @include transition(background);

    &::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: $surface;
      box-shadow: $shadow-sm;
      @include transition(transform);
    }
  }

  &__input:checked + &__track {
    background: $accent;

    &::after {
      transform: translateX(20px);
    }
  }

  &__input:focus-visible + &__track {
    outline: 2px solid $accent;
    outline-offset: 3px;
  }
}
</style>
