<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import AuthCard from '@/components/account/AuthCard.vue'
import FormField from '@/components/checkout/FormField.vue'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Solo rutas internas: un ?next= externo no debe sacar a nadie de la tienda.
const next = computed(() => {
  const value = route.query.next
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : ''
})

async function submit() {
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = 'Escribe tu correo y tu contraseña'
    return
  }
  loading.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    toast.success(`Hola, ${user.name?.split(' ')[0] || 'bella'}`)
    router.replace(next.value || (userStore.isAdmin ? '/admin' : '/cuenta'))
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard
    eyebrow="Equipo Ivonne"
    title="Ingreso al panel"
    subtitle="Acceso para administrar productos, pedidos y usuarios."
    :error="error"
    @submit="submit"
  >
    <FormField id="email" label="Correo">
      <input id="email" v-model="email" type="email" autocomplete="email" inputmode="email" required />
    </FormField>

    <FormField id="password" label="Contraseña">
      <div class="login__password">
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
        />
        <button
          type="button"
          class="login__eye"
          :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          @click="showPassword = !showPassword"
        >
          <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" aria-hidden="true"></i>
        </button>
      </div>
    </FormField>

    <template #actions>
      <button class="btn btn--primary auth__submit" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        {{ loading ? 'Ingresando…' : 'Ingresar' }}
      </button>
    </template>

    <template #footer>
      ¿Compraste en la tienda?
      <RouterLink to="/mi-pedido">Consulta tu pedido sin cuenta</RouterLink>
    </template>
  </AuthCard>
</template>

<style scoped lang="scss">
.login {
  &__password {
    position: relative;

    input {
      padding-right: 3rem;
    }
  }

  &__eye {
    position: absolute;
    top: 50%;
    right: 0.2rem;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    color: $ink-muted;

    &:hover {
      color: $accent;
    }
  }
}
</style>
