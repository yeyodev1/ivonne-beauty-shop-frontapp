<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import ProfileForm from '@/components/account/ProfileForm.vue'
import PasswordForm from '@/components/account/PasswordForm.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const firstName = computed(() => userStore.user?.name?.split(' ')[0] || 'bella')

function logout() {
  userStore.clear()
  toast.info('Cerraste sesión. ¡Vuelve pronto!')
  router.replace('/')
}
</script>

<template>
  <section class="account">
    <header class="account__head">
      <p class="account__eyebrow">Mi cuenta</p>
      <h1 class="account__title">Hola, <em>{{ firstName }}</em></h1>
      <p class="account__email">{{ userStore.user?.email }}</p>
    </header>

    <nav class="account__shortcuts" aria-label="Accesos de mi cuenta">
      <RouterLink to="/cuenta/pedidos" class="account__shortcut">
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        <span><strong>Mis pedidos</strong><small>Estado y detalle de tus compras</small></span>
        <i class="fa-solid fa-chevron-right account__arrow" aria-hidden="true"></i>
      </RouterLink>
      <RouterLink v-if="userStore.isAdmin" to="/admin" class="account__shortcut account__shortcut--admin">
        <i class="fa-solid fa-gauge" aria-hidden="true"></i>
        <span><strong>Panel de administración</strong><small>Productos, pedidos y ajustes</small></span>
        <i class="fa-solid fa-chevron-right account__arrow" aria-hidden="true"></i>
      </RouterLink>
    </nav>

    <div class="account__panels">
      <ProfileForm />
      <PasswordForm />
    </div>

    <button type="button" class="account__logout" @click="logout">
      <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i> Cerrar sesión
    </button>
  </section>
</template>

<style scoped lang="scss">
.account {
  @include container(960px);
  @include flex(column, stretch, flex-start, 1.2rem);
  padding-block: 1.8rem $space-xl;

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 500);
    margin-top: 0.3rem;

    em {
      color: $accent;
    }
  }

  &__email {
    color: $ink-soft;
    font-size: $text-sm;
    word-break: break-word;
  }

  &__shortcuts {
    @include flex(column, stretch, flex-start, 0.7rem);

    @include from('md') {
      flex-direction: row;

      > * {
        flex: 1 1 0;
      }
    }
  }

  &__shortcut {
    @include card;
    @include flex(row, center, flex-start, 0.9rem);
    min-height: 64px;
    padding: 0.9rem 1rem;
    transition: border-color 0.25s ease;

    &:hover {
      border-color: $accent;
    }

    > i:first-child {
      @include flex(row, center, center);
      flex: 0 0 40px;
      height: 40px;
      border-radius: 50%;
      background: $accent-soft;
      color: $accent-deep;
    }

    span {
      @include flex(column, flex-start, flex-start);
      flex: 1;
      min-width: 0;
    }

    small {
      font-size: $text-xs;
      color: $ink-soft;
    }

    &--admin > i:first-child {
      background: $ink;
      color: $surface;
    }
  }

  &__arrow {
    color: $ink-muted;
    font-size: 0.8rem;
  }

  &__panels {
    @include flex(column, stretch, flex-start, 1.2rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;

      > * {
        flex: 1 1 0;
        min-width: 0;
      }
    }
  }

  &__logout {
    align-self: center;
    @include flex(row, center, center, 0.5rem);
    min-height: 48px;
    padding-inline: 1.2rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
  }
}
</style>
