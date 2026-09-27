<script setup lang="ts">
import AdminSwitch from './AdminSwitch.vue'
import AdminFilterChips from './AdminFilterChips.vue'
import type { AccountType, AdminUser } from '@/types'

defineProps<{
  form: { name: string; email: string; phone: string; password: string; accountType: AccountType; isActive: boolean }
  user: AdminUser | null
  isSelf: boolean
}>()

const ROLES = [
  { value: 'admin', label: 'Administración' },
  { value: 'customer', label: 'Clienta' },
]
</script>

<template>
  <div class="uform">
    <div>
      <label for="u-name">Nombre</label>
      <input id="u-name" v-model="form.name" type="text" autocomplete="off" placeholder="Ej: Ivonne Pérez" />
    </div>
    <div>
      <label for="u-email">Correo</label>
      <input
        id="u-email"
        v-model="form.email"
        type="email"
        inputmode="email"
        autocomplete="off"
        placeholder="correo@ejemplo.com"
        :disabled="Boolean(user)"
      />
      <small v-if="user">El correo no se puede cambiar.</small>
    </div>
    <div>
      <label for="u-phone">Celular</label>
      <input id="u-phone" v-model="form.phone" type="tel" inputmode="tel" placeholder="0991234567" />
    </div>
    <div>
      <label for="u-password">{{ user ? 'Nueva contraseña' : 'Contraseña' }}</label>
      <input
        id="u-password"
        v-model="form.password"
        type="text"
        autocomplete="new-password"
        :placeholder="user ? 'Déjala vacía para no cambiarla' : 'Mínimo 8 caracteres'"
      />
    </div>

    <div>
      <p class="uform__label">Tipo de cuenta</p>
      <AdminFilterChips v-if="!isSelf" v-model="form.accountType" :options="ROLES" label="Tipo de cuenta" />
      <p v-else class="uform__hint">Es tu cuenta: no puedes quitarte el acceso al panel.</p>
      <small v-if="!isSelf">Administración entra al panel y gestiona productos, pedidos y usuarios.</small>
    </div>

    <AdminSwitch
      v-if="user && !isSelf"
      id="u-active"
      v-model="form.isActive"
      label="Cuenta activa"
      hint="Si la apagas, no podrá iniciar sesión"
    />
  </div>
</template>

<style scoped lang="scss">
.uform {
  @include flex(column, stretch, flex-start, 0.9rem);

  input {
    font-size: 1rem;
  }

  input:disabled {
    opacity: 0.6;
  }

  small {
    display: block;
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.3rem;
  }

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
