<script setup lang="ts">
withDefaults(defineProps<{ rows?: number; height?: string }>(), { rows: 4, height: '78px' })
</script>

<template>
  <div class="skeleton" aria-busy="true" aria-label="Cargando">
    <span v-for="n in rows" :key="n" class="skeleton__row" :style="{ height }"></span>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__row {
    display: block;
    border-radius: 14px;
    background: linear-gradient(90deg, $sand 0%, $paper 50%, $sand 100%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;

    @include reduced-motion {
      animation: none;
    }
  }
}

@keyframes shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
</style>
