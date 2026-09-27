import { reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { AccountType, AdminUser, ApiError } from '@/types'

const MIN_PASSWORD = 8

/** Crear y editar cuentas (admins y clientas) desde la hoja inferior. */
export function useAdminUserEditor(onSaved: () => void) {
  const toast = useToastStore()

  const open = ref(false)
  const editing = ref<AdminUser | null>(null)
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    password: '',
    accountType: 'admin' as AccountType,
    isActive: true,
  })
  const saving = ref(false)

  function start(user: AdminUser | null = null) {
    editing.value = user
    Object.assign(form, {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
      // Desde el panel lo normal es dar acceso al equipo: por defecto admin.
      accountType: user?.accountType || 'admin',
      isActive: user ? user.isActive : true,
    })
    open.value = true
  }

  function validate(): string {
    if (!form.name.trim()) return 'Escribe el nombre'
    if (!editing.value && !form.email.trim()) return 'Escribe el correo'
    if (!editing.value && form.password.length < MIN_PASSWORD) {
      return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`
    }
    if (editing.value && form.password && form.password.length < MIN_PASSWORD) {
      return `La nueva contraseña debe tener al menos ${MIN_PASSWORD} caracteres`
    }
    return ''
  }

  async function save() {
    const problem = validate()
    if (problem) {
      toast.error(problem)
      return
    }
    saving.value = true
    const base = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      accountType: form.accountType,
    }
    try {
      if (editing.value) {
        await adminService.updateUser(editing.value.id, {
          ...base,
          isActive: form.isActive,
          ...(form.password ? { password: form.password } : {}),
        })
        toast.success('Usuario actualizado')
      } else {
        await adminService.createUser({ ...base, email: form.email.trim(), password: form.password })
        toast.success('Usuario creado. Ya puede ingresar con su correo y contraseña')
      }
      open.value = false
      onSaved()
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  return { open, editing, form, saving, start, save }
}
