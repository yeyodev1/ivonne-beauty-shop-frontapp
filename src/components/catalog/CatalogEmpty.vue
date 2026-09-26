<script setup lang="ts">
import { computed } from 'vue'
import { whatsappLink } from '@/config/site'

const props = defineProps<{ search?: string; filtered: boolean }>()
const emit = defineEmits<{ clear: [] }>()

const message = computed(() =>
  props.search
    ? `Hola, estoy buscando "${props.search}". ¿Lo tienen disponible?`
    : 'Hola, estoy buscando un producto y no lo encuentro en la web. ¿Me ayudan?',
)
</script>

<template>
  <div class="empty">
    <span class="empty__icon"><i class="fa-regular fa-face-smile-wink"></i></span>
    <h2 class="empty__title">¿No encuentras lo que buscas? <em>Pregúntanos</em></h2>
    <p class="empty__text">
      <template v-if="search">No tenemos resultados para «{{ search }}» en la web.</template>
      <template v-else>Todavía no hay productos con estos filtros.</template>
      Muchas novedades llegan primero a la tienda: escríbenos y te decimos si lo tenemos.
    </p>
    <div class="empty__actions">
      <a :href="whatsappLink(message)" class="btn btn--primary" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp"></i> Preguntar por WhatsApp
      </a>
      <button v-if="filtered" type="button" class="btn btn--ghost" @click="emit('clear')">
        Quitar filtros
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.8rem);
  text-align: center;
  padding: $space-xl 1.25rem;
  background: $sand;
  border-radius: $radius-lg;

  &__icon {
    @include flex(row, center, center);
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 50%;
    background: $surface;
    color: $accent;
    font-size: 1.5rem;
  }

  &__title {
    @include display($display-sm);

    em {
      color: $accent;
    }
  }

  &__text {
    color: $ink-soft;
    max-width: 46ch;
    font-size: $text-sm;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }
}
</style>
