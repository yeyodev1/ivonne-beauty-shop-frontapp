<script setup lang="ts">
import { reactive, ref } from 'vue'
import { authService } from '@/services/auth.service'
import { useToastStore } from '@/stores/toast'
import FormField from '@/components/checkout/FormField.vue'
import AccountPanel from './AccountPanel.vue'
import type { ApiError } from '@/types'

const toast = useToastStore()

const form = reactive({ current: '', next: '', confirm: '' })
const errors = reactive<{ current?: string; next?: string; confirm?: string }>({})
const saving = ref(false)

async function save() {
  errors.current = form.current ? undefined : 'Escribe tu contraseña actual'
  errors.next = form.next.length >= 8 ? undefined : 'Mínimo 8 caracteres'
  errors.confirm = form.confirm === form.next ? undefined : 'Las contraseñas no coinciden'
  if (errors.current || errors.next || errors.confirm) return

  saving.value = true
  try {
    await authService.changePassword(form.current, form.next)
    form.current = form.next = form.confirm = ''
    toast.success('Actualizamos tu contraseña')
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AccountPanel title="Cambiar contraseña" icon="fa-solid fa-key">
    <form novalidate @submit.prevent="save">
      <FormField id="pw-current" label="Contraseña actual" :error="errors.current">
        <input id="pw-current" v-model="form.current" type="password" autocomplete="current-password" />
      </FormField>
      <FormField id="pw-next" label="Nueva contraseña" :error="errors.next" hint="Mínimo 8 caracteres.">
        <input id="pw-next" v-model="form.next" type="password" autocomplete="new-password" />
      </FormField>
      <FormField id="pw-confirm" label="Confirma la nueva contraseña" :error="errors.confirm">
        <input id="pw-confirm" v-model="form.confirm" type="password" autocomplete="new-password" />
      </FormField>
      <div>
        <button class="btn btn--ghost" type="submit" :disabled="saving">
          <i v-if="saving" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
          Actualizar contraseña
        </button>
      </div>
    </form>
  </AccountPanel>
</template>
