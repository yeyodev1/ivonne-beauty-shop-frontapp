<script setup lang="ts">
defineProps<{
  step: number
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="step" :aria-labelledby="`step-${step}-title`">
    <header class="step__head">
      <span class="step__number" aria-hidden="true">{{ step }}</span>
      <div class="step__titles">
        <h2 :id="`step-${step}-title`" class="step__title">{{ title }}</h2>
        <p v-if="subtitle" class="step__subtitle">{{ subtitle }}</p>
      </div>
      <slot name="aside" />
    </header>
    <div class="step__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.step {
  @include card;
  padding: 1.25rem 1rem;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 1.6rem 1.6rem;
  }

  &__head {
    @include flex(row, flex-start, flex-start, 0.75rem);
    margin-bottom: 1.1rem;
  }

  &__number {
    @include flex(row, center, center);
    flex: 0 0 32px;
    height: 32px;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
    font-weight: 700;
    font-size: $text-sm;
  }

  &__titles {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 600;
    line-height: 1.3;
    padding-top: 0.2rem;
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.2rem;
  }
}
</style>
