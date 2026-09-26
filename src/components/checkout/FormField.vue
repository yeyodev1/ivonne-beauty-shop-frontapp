<script setup lang="ts">
defineProps<{
  id: string
  label: string
  error?: string
  hint?: string
}>()
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label :for="id">{{ label }}</label>
    <slot />
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start);
  min-width: 0;

  :slotted(input),
  :slotted(textarea),
  :slotted(select) {
    min-height: 48px;
    font-size: 1rem; // 16px evita el zoom automático de iOS
  }

  &--invalid :slotted(input),
  &--invalid :slotted(textarea) {
    border-color: $danger;
  }

  &__error,
  &__hint {
    font-size: $text-xs;
    margin-top: 0.35rem;
    line-height: 1.4;
  }

  &__error {
    color: $danger;
  }

  &__hint {
    color: $ink-muted;
  }
}
</style>
