<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
  error?: string
}>()

const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <section class="auth">
    <form class="auth__card" novalidate @submit.prevent="emit('submit')">
      <span class="auth__bow" aria-hidden="true"><i class="fa-solid fa-heart"></i></span>
      <p class="auth__eyebrow">{{ eyebrow }}</p>
      <h1 class="auth__title">{{ title }}</h1>
      <p v-if="subtitle" class="auth__subtitle">{{ subtitle }}</p>

      <div class="auth__fields">
        <slot />
      </div>

      <Transition name="rise">
        <p v-if="error" class="auth__error" role="alert">
          <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
        </p>
      </Transition>

      <slot name="actions" />

      <footer v-if="$slots.footer" class="auth__footer">
        <slot name="footer" />
      </footer>
    </form>
  </section>
</template>

<style scoped lang="scss">
.auth {
  @include container(480px);
  @include flex(column, stretch, center);
  flex: 1;
  padding-block: $space-lg $space-xl;

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 0.9rem);
    position: relative;
    padding: 2rem 1.1rem 1.6rem;
    box-shadow: $shadow-md;
    background: linear-gradient(180deg, $sand 0%, $surface 150px);

    @include from('sm') {
      padding: 2.4rem 2rem 2rem;
    }
  }

  &__bow {
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $surface;
    color: $accent;
    box-shadow: $shadow-sm;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 500);
  }

  &__subtitle {
    color: $ink-soft;
    font-size: $text-sm;
    margin-top: -0.3rem;
  }

  &__fields {
    @include flex(column, stretch, flex-start, 1rem);
    margin-top: 0.4rem;

    :deep(input) {
      min-height: 48px;
      font-size: 1rem;
    }
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
  }

  :deep(.auth__submit) {
    width: 100%;
    min-height: 50px;
    margin-top: 0.3rem;
  }

  &__footer {
    text-align: center;
    font-size: $text-sm;
    color: $ink-soft;
    padding-top: 0.6rem;
    border-top: 1px solid $line;

    :deep(a) {
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }
}
</style>
