<script setup lang="ts">
import { nextTick, onUnmounted, ref, toRef, watch } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'

const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()

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
    <Transition name="asheet">
      <div v-if="open" class="asheet" @click.self="emit('close')">
        <div ref="panel" class="asheet__panel" tabindex="-1" role="dialog" aria-modal="true" :aria-label="title">
          <header class="asheet__head">
            <h2 class="asheet__title">{{ title }}</h2>
            <button type="button" class="asheet__close" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="asheet__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="asheet__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
// Hoja inferior en el celular, diálogo centrado en pantallas grandes
.asheet {
  position: fixed;
  inset: 0;
  z-index: 160;
  background: $overlay;
  @include flex(column, stretch, flex-end);

  @include from('md') {
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  &__panel {
    outline: none;
    @include flex(column, stretch, flex-start);
    background: $surface;
    border-radius: $radius-md $radius-md 0 0;
    max-height: 92vh;
    max-height: 92dvh;
    width: 100%;

    @include from('md') {
      max-width: 520px;
      border-radius: $radius-md;
    }
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
    padding: 0.8rem 0.6rem 0.4rem 1.1rem;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $ink-soft;
    @include focus-ring;
  }

  &__body {
    flex: 1 1 auto;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.4rem 1.1rem 1rem;
  }

  &__foot {
    @include flex(row, center, flex-end, 0.5rem);
    padding: 0.7rem 1.1rem calc(0.8rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
  }
}

.asheet-enter-active,
.asheet-leave-active {
  transition: opacity 0.25s ease;

  .asheet__panel {
    transition: transform 0.3s $ease;
  }
}

.asheet-enter-from,
.asheet-leave-to {
  opacity: 0;

  .asheet__panel {
    transform: translateY(40px);
  }
}
</style>
