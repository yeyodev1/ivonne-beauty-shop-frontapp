<script setup lang="ts">
const emit = defineEmits<{ navigate: [] }>()
</script>

<template>
  <div class="empty">
    <span class="empty__icon"><i class="fa-solid fa-bag-shopping"></i></span>
    <h2 class="empty__title">Tu bolsa está <em>vacía</em></h2>
    <p class="empty__text">Date un gustito: labiales, sérums y perfumes originales te esperan.</p>
    <RouterLink to="/tienda" class="btn btn--primary" @click="emit('navigate')">
      Ir a la tienda
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.7rem);
  text-align: center;
  padding: $space-lg 1rem;

  &__icon {
    @include flex(row, center, center);
    width: 4.2rem;
    height: 4.2rem;
    border-radius: 50% 50% $radius-sm $radius-sm;
    background: $sand;
    color: $accent;
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }

  &__title {
    @include display($display-sm);

    em {
      color: $accent;
    }
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
    max-width: 30ch;
    margin-bottom: 0.4rem;
  }
}
</style>
