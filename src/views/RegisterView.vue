<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
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

const form = reactive({ name: '', email: '', phone: '', password: '', confirm: '' })
const errors = reactive<Partial<Record<keyof typeof form, string>>>({})
const loading = ref(false)
const error = ref('')

const next = computed(() => {
  const value = route.query.next
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : ''
})

function validate(): boolean {
  for (const key of Object.keys(errors) as Array<keyof typeof form>) delete errors[key]
  if (form.name.trim().length < 3) errors.name = 'Escribe tu nombre'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Revisa tu correo'
  if (!/^09\d{8}$/.test(form.phone.replace(/\D/g, ''))) errors.phone = 'Celular de 10 dígitos que empiece con 09'
  if (form.password.length < 8) errors.password = 'Mínimo 8 caracteres'
  if (form.confirm !== form.password) errors.confirm = 'Las contraseñas no coinciden'
  return Object.keys(errors).length === 0
}

async function submit() {
  error.value = ''
  if (!validate()) return
  loading.value = true
  try {
    const user = await userStore.register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.replace(/\D/g, ''),
      password: form.password,
    })
    toast.success(`Bienvenida, ${user.name.split(' ')[0]}`)
    router.replace(next.value || '/cuenta')
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard
    eyebrow="Crear cuenta"
    title="Únete, bella"
    subtitle="Guarda tus datos, sigue tus pedidos y compra más rápido."
    :error="error"
    @submit="submit"
  >
    <FormField id="name" label="Nombre completo" :error="errors.name">
      <input id="name" v-model="form.name" type="text" autocomplete="name" :aria-invalid="Boolean(errors.name)" />
    </FormField>
    <FormField id="email" label="Correo" :error="errors.email">
      <input
        id="email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        inputmode="email"
        :aria-invalid="Boolean(errors.email)"
      />
    </FormField>
    <FormField id="phone" label="Celular" :error="errors.phone" hint="Para coordinar tus entregas por WhatsApp.">
      <input
        id="phone"
        v-model="form.phone"
        type="tel"
        autocomplete="tel-national"
        inputmode="numeric"
        maxlength="10"
        placeholder="0991234567"
        :aria-invalid="Boolean(errors.phone)"
      />
    </FormField>
    <FormField id="password" label="Contraseña" :error="errors.password" hint="Mínimo 8 caracteres.">
      <input
        id="password"
        v-model="form.password"
        type="password"
        autocomplete="new-password"
        :aria-invalid="Boolean(errors.password)"
      />
    </FormField>
    <FormField id="confirm" label="Confirma tu contraseña" :error="errors.confirm">
      <input
        id="confirm"
        v-model="form.confirm"
        type="password"
        autocomplete="new-password"
        :aria-invalid="Boolean(errors.confirm)"
      />
    </FormField>

    <template #actions>
      <button class="btn btn--primary auth__submit" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        {{ loading ? 'Creando tu cuenta…' : 'Crear mi cuenta' }}
      </button>
    </template>

    <template #footer>
      ¿Ya tienes cuenta?
      <RouterLink :to="{ path: '/login', query: next ? { next } : {} }">Ingresa aquí</RouterLink>
    </template>
  </AuthCard>
</template>
