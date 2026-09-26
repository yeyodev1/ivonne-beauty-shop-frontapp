<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__media"></div>
    <div class="skeleton__body">
      <span class="skeleton__line skeleton__line--short"></span>
      <span class="skeleton__line"></span>
      <span class="skeleton__line skeleton__line--mid"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  border-radius: $radius-md;
  border: 1px solid $line;
  overflow: hidden;
  background: $surface;

  &__media {
    aspect-ratio: 1;
    background: $sand;
    animation: pulse 1.6s ease-in-out infinite;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.5rem);
    padding: 0.9rem;
  }

  &__line {
    height: 0.7rem;
    border-radius: $radius-pill;
    background: $sand;
    animation: pulse 1.6s ease-in-out infinite;

    &--short {
      width: 40%;
    }

    &--mid {
      width: 60%;
    }
  }
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

@include reduced-motion {
  .skeleton__media,
  .skeleton__line {
    animation: none;
  }
}
</style>
