<script setup lang="ts">
import { ADMIN_NAV, type AdminNavItem } from '@/composables/useAdminNav'

defineProps<{ isActive: (item: AdminNavItem) => boolean; moreActive: boolean }>()
const emit = defineEmits<{ more: [] }>()
</script>

<template>
  <nav class="tabbar" aria-label="Secciones del panel">
    <RouterLink
      v-for="item in ADMIN_NAV"
      :key="item.label"
      :to="item.to"
      class="tabbar__item"
      :class="{ 'tabbar__item--active': isActive(item) }"
      :aria-current="isActive(item) ? 'page' : undefined"
    >
      <i :class="item.icon" aria-hidden="true"></i>
      <span>{{ item.label }}</span>
    </RouterLink>
    <button
      type="button"
      class="tabbar__item"
      :class="{ 'tabbar__item--active': moreActive }"
      @click="emit('more')"
    >
      <i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
      <span>Más</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  @include flex(row, stretch, space-around);
  background: rgba($surface, 0.96);
  backdrop-filter: blur(10px);
  border-top: 1px solid $line;
  padding-bottom: env(safe-area-inset-bottom);

  @include from('lg') {
    display: none;
  }

  &__item {
    flex: 1 1 0;
    min-width: 0;
    @include flex(column, center, center, 0.2rem);
    min-height: 60px;
    font-size: 0.66rem;
    font-weight: 600;
    color: $ink-muted;
    position: relative;
    @include transition(color);
    @include focus-ring;

    i {
      font-size: 1.1rem;
    }

    span {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &--active {
      color: $accent;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        width: 28px;
        height: 3px;
        border-radius: 0 0 3px 3px;
        background: $accent;
      }
    }
  }
}
</style>
