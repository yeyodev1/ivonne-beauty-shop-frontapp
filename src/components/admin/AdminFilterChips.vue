<script setup lang="ts">
defineProps<{
  options: Array<{ value: string; label: string }>
  label: string
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="filters" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="filters__chip"
      :class="{ 'filters__chip--active': model === option.value }"
      :aria-pressed="model === option.value"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
// Fila deslizable: en 360 px los chips no caben y es más cómodo arrastrar que envolver.
.filters {
  @include flex(row, center, flex-start, 0.45rem);
  overflow-x: auto;
  scrollbar-width: none;
  margin-inline: -1rem;
  padding: 0.15rem 1rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('lg') {
    flex-wrap: wrap;
    margin-inline: 0;
    padding-inline: 0;
  }

  &__chip {
    flex: 0 0 auto;
    min-height: 38px;
    padding: 0 0.95rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: $ink-soft;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-pill;
    @include transition;
    @include focus-ring;

    &--active {
      color: $surface;
      background: $accent;
      border-color: $accent;
    }
  }
}
</style>
