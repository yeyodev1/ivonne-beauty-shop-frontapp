<script setup lang="ts">
defineProps<{ json: string; transactionId: string }>()
const emit = defineEmits<{ copy: [] }>()
</script>

<template>
  <details class="payphone">
    <summary class="payphone__summary">
      <i class="fa-solid fa-code" aria-hidden="true"></i>
      Respuesta de Payphone
      <i class="fa-solid fa-chevron-down payphone__chev" aria-hidden="true"></i>
    </summary>
    <div class="payphone__body">
      <p class="payphone__id">Transacción: <code>{{ transactionId || '—' }}</code></p>
      <template v-if="json">
        <pre class="payphone__pre">{{ json }}</pre>
        <button type="button" class="btn btn--ghost payphone__copy" @click="emit('copy')">
          <i class="fa-regular fa-copy" aria-hidden="true"></i> Copiar JSON
        </button>
      </template>
      <p v-else class="payphone__empty">Payphone todavía no ha enviado respuesta para este pedido.</p>
    </div>
  </details>
</template>

<style scoped lang="scss">
.payphone {
  @include card;

  &__summary {
    @include flex(row, center, flex-start, 0.6rem);
    min-height: 52px;
    padding: 0 1rem;
    font-size: $text-sm;
    font-weight: 600;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    > i:first-child {
      color: $ink-muted;
    }
  }

  &__chev {
    margin-left: auto;
    font-size: 0.75rem;
    color: $ink-muted;
    @include transition(transform);
  }

  &[open] &__chev {
    transform: rotate(180deg);
  }

  &__body {
    padding: 0 1rem 1rem;
  }

  &__id {
    font-size: $text-xs;
    color: $ink-soft;
    margin-bottom: 0.6rem;
    overflow-wrap: anywhere;
  }

  &__pre {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.72rem;
    line-height: 1.5;
    background: $ink;
    color: $paper;
    border-radius: $radius-sm;
    padding: 0.8rem;
    max-height: 360px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__copy {
    margin-top: 0.6rem;
    min-height: 44px;
    padding-inline: 1.1rem;
    font-size: 0.78rem;
  }

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }
}
</style>
