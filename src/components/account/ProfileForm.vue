<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import FormField from '@/components/checkout/FormField.vue'
import AccountPanel from './AccountPanel.vue'
import type { ApiError } from '@/types'

const userStore = useUserStore()
const toast = useToastStore()

const form = reactive({ name: '', phone: '' })
const errors = reactive<{ name?: string; phone?: string }>({})
const saving = ref(false)

watch(
  () => userStore.user,
  (user) => {
    form.name = user?.name || ''
    form.phone = user?.phone || ''
  },
  { immediate: true },
)

async function save() {
  errors.name = form.name.trim().length < 3 ? 'Escribe tu nombre' : undefined
  const phone = form.phone.replace(/\D/g, '')
  errors.phone = phone && !/^09\d{8}$/.test(phone) ? 'Celular de 10 dígitos que empiece con 09' : undefined
  if (errors.name || errors.phone) return

  saving.value = true
  try {
    await userStore.updateProfile({ name: form.name.trim(), phone })
    toast.success('Tus datos quedaron guardados')
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AccountPanel title="Mis datos" icon="fa-regular fa-user">
    <form novalidate @submit.prevent="save">
      <FormField id="profile-email" label="Correo" hint="El correo no se puede cambiar.">
        <input id="profile-email" :value="userStore.user?.email" type="email" disabled />
      </FormField>
      <FormField id="profile-name" label="Nombre completo" :error="errors.name">
        <input id="profile-name" v-model="form.name" type="text" autocomplete="name" />
      </FormField>
      <FormField id="profile-phone" label="Celular" :error="errors.phone">
        <input
          id="profile-phone"
          v-model="form.phone"
          type="tel"
          inputmode="numeric"
          maxlength="10"
          autocomplete="tel-national"
          placeholder="0991234567"
        />
      </FormField>
      <div>
        <button class="btn btn--dark" type="submit" :disabled="saving">
          <i v-if="saving" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
          Guardar cambios
        </button>
      </div>
    </form>
  </AccountPanel>
</template>
