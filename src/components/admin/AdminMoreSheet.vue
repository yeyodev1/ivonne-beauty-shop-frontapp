<script setup lang="ts">
import { nextTick, onUnmounted, ref, toRef, watch } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { ADMIN_NAV_MORE } from '@/composables/useAdminNav'

const props = defineProps<{ open: boolean; userName?: string }>()
const emit = defineEmits<{ close: []; logout: [] }>()

useBodyScroll(toRef(props, 'open'))

const panel = ref<HTMLElement | null>(null)

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

// Escape cierra y el foco entra a la hoja para que el teclado/lector no se quede atrás
watch(
  () => props.open,
  async (open) => {
    if (open) {
      document.addEventListener('keydown', onKey)
      await nextTick()
      panel.value?.focus()
    } else {
      document.removeEventListener('keydown', onKey)
    }
  },
)

onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet" @click.self="emit('close')">
        <div ref="panel" class="sheet__panel" tabindex="-1" role="dialog" aria-modal="true" aria-label="Más opciones">
          <span class="sheet__grip" aria-hidden="true"></span>
          <p v-if="userName" class="sheet__hello">Hola, {{ userName }}</p>
          <RouterLink
            v-for="item in ADMIN_NAV_MORE"
            :key="item.label"
            :to="item.to"
            class="sheet__link"
            @click="emit('close')"
          >
            <i :class="item.icon" aria-hidden="true"></i>
            {{ item.label }}
            <i class="fa-solid fa-chevron-right sheet__chev" aria-hidden="true"></i>
          </RouterLink>
          <RouterLink to="/" class="sheet__link" @click="emit('close')">
            <i class="fa-solid fa-store" aria-hidden="true"></i>
            Ver tienda
            <i class="fa-solid fa-chevron-right sheet__chev" aria-hidden="true"></i>
          </RouterLink>
          <button type="button" class="sheet__link sheet__link--danger" @click="emit('logout')">
            <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
            Cerrar sesión
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: $overlay;
  @include flex(column, stretch, flex-end);

  &__panel {
    outline: none;
    @include flex(column, stretch, flex-start, 0.2rem);
    background: $surface;
    border-radius: $radius-md $radius-md 0 0;
    padding: 0.6rem 1rem calc(1rem + env(safe-area-inset-bottom));
  }

  &__grip {
    align-self: center;
    width: 40px;
    height: 4px;
    border-radius: 4px;
    background: $line;
    margin-bottom: 0.6rem;
  }

  &__hello {
    font-family: $font-display;
    font-size: $text-lg;
    padding: 0.2rem 0.4rem 0.6rem;
  }

  &__link {
    @include flex(row, center, flex-start, 0.9rem);
    min-height: 54px;
    padding: 0 0.6rem;
    border-radius: $radius-sm;
    font-weight: 500;
    text-align: left;
    width: 100%;
    @include focus-ring;

    > i:first-child {
      width: 22px;
      color: $accent;
      text-align: center;
    }

    &:active {
      background: $sand;
    }

    &--danger {
      color: $danger;

      > i:first-child {
        color: $danger;
      }
    }
  }

  &__chev {
    margin-left: auto;
    font-size: 0.75rem;
    color: $ink-muted;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;

  .sheet__panel {
    transition: transform 0.3s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__panel {
    transform: translateY(100%);
  }
}
</style>
