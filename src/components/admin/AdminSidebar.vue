<script setup lang="ts">
import { ADMIN_NAV, ADMIN_NAV_MORE, type AdminNavItem } from '@/composables/useAdminNav'

defineProps<{ isActive: (item: AdminNavItem) => boolean; userName?: string }>()
const emit = defineEmits<{ logout: [] }>()

const items = [...ADMIN_NAV, ...ADMIN_NAV_MORE]
</script>

<template>
  <aside class="sidebar">
    <RouterLink :to="{ name: 'AdminDashboard' }" class="sidebar__brand">
      Ivonne <em>Beauty</em>
      <small>Panel de la tienda</small>
    </RouterLink>
    <nav class="sidebar__nav" aria-label="Secciones del panel">
      <RouterLink
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
      >
        <i :class="item.icon" aria-hidden="true"></i>
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="sidebar__foot">
      <p v-if="userName" class="sidebar__user">{{ userName }}</p>
      <button type="button" class="sidebar__link" @click="emit('logout')">
        <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  display: none;

  @include from('lg') {
    @include flex(column, stretch, flex-start, 1.6rem);
    position: sticky;
    top: 0;
    height: 100vh;
    width: 240px;
    flex: 0 0 240px;
    padding: 1.8rem 1rem;
    background: $surface;
    border-right: 1px solid $line;
  }

  &__brand {
    font-family: $font-display;
    font-size: 1.5rem;
    padding: 0 0.8rem;
    line-height: 1.1;

    em {
      color: $accent;
    }

    small {
      display: block;
      @include eyebrow;
      font-size: 0.62rem;
      margin-top: 0.4rem;
    }
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.2rem);
  }

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    min-height: 44px;
    padding: 0 0.8rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    width: 100%;
    @include transition;
    @include focus-ring;

    i {
      width: 20px;
      text-align: center;
      color: $ink-muted;
    }

    &:hover {
      background: $sand;
      color: $ink;
    }

    &--active {
      background: $accent-soft;
      color: $accent-deep;
      font-weight: 600;

      i {
        color: $accent;
      }
    }
  }

  &__foot {
    margin-top: auto;
    border-top: 1px solid $line;
    padding-top: 1rem;
  }

  &__user {
    font-size: $text-xs;
    color: $ink-muted;
    padding: 0 0.8rem 0.4rem;
  }
}
</style>
