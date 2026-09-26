<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminTabBar from '@/components/admin/AdminTabBar.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminMoreSheet from '@/components/admin/AdminMoreSheet.vue'
import { useAdminNav } from '@/composables/useAdminNav'

const route = useRoute()
const { title, backTo, isActive, moreActive, logout, userStore } = useAdminNav()

const moreOpen = ref(false)

watch(
  () => route.fullPath,
  () => (moreOpen.value = false),
)

function onLogout() {
  moreOpen.value = false
  logout()
}
</script>

<template>
  <div class="admin">
    <AdminSidebar :is-active="isActive" :user-name="userStore.user?.name" @logout="onLogout" />

    <div class="admin__main">
      <header class="admin__bar">
        <RouterLink v-if="backTo" :to="backTo" class="admin__icon-btn" aria-label="Volver">
          <i class="fa-solid fa-arrow-left"></i>
        </RouterLink>
        <h1 class="admin__title">{{ title }}</h1>
        <RouterLink to="/" class="admin__store">
          <i class="fa-solid fa-store" aria-hidden="true"></i>
          <span>Ver tienda</span>
        </RouterLink>
      </header>

      <main class="admin__content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <AdminTabBar :is-active="isActive" :more-active="moreActive" @more="moreOpen = true" />
    <AdminMoreSheet
      :open="moreOpen"
      :user-name="userStore.user?.name"
      @close="moreOpen = false"
      @logout="onLogout"
    />
  </div>
</template>

<style scoped lang="scss">
.admin {
  @include flex(row, stretch, flex-start);
  min-height: 100vh;
  background: $paper;
  font-family: $font-principal;

  &__main {
    flex: 1 1 auto;
    min-width: 0;
    @include flex(column, stretch, flex-start);
  }

  &__bar {
    position: sticky;
    top: 0;
    z-index: 90;
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 58px;
    padding: 0.4rem 0.75rem 0.4rem 1rem;
    padding-top: calc(0.4rem + env(safe-area-inset-top));
    background: rgba($surface, 0.94);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid $line;

    @include from('lg') {
      padding-inline: 2rem;
      min-height: 68px;
    }
  }

  &__icon-btn {
    @include flex(row, center, center);
    flex: 0 0 44px;
    height: 44px;
    margin-left: -0.5rem;
    border-radius: 50%;
    color: $ink;
    @include focus-ring;
  }

  &__title {
    @include display($text-xl, 600);
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__store {
    @include flex(row, center, center, 0.45rem);
    flex: 0 0 auto;
    min-height: 40px;
    padding: 0 0.9rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: $accent-deep;
    background: $accent-soft;
    border-radius: $radius-pill;
    @include focus-ring;
  }

  &__content {
    flex: 1 1 auto;
    width: 100%;
    max-width: 1100px;
    margin-inline: auto;
    // Aire abajo para que la tab bar fija no tape lo último de la página
    padding: 1rem 1rem calc(90px + env(safe-area-inset-bottom));

    @include from('md') {
      padding-inline: 1.6rem;
    }

    @include from('lg') {
      padding: 1.8rem 2rem 3rem;
    }
  }
}
</style>
