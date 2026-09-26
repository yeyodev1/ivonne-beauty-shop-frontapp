<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ id: string; label: string }>()

const model = defineModel<string[]>({ required: true })
const draft = ref('')

function add() {
  // Se aceptan varias separadas por coma: "labial, mate, larga duración"
  const fresh = draft.value
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag && !model.value.includes(tag))
  if (fresh.length) model.value = [...model.value, ...fresh]
  draft.value = ''
}

function remove(tag: string) {
  model.value = model.value.filter((t) => t !== tag)
}

function onBackspace() {
  if (!draft.value && model.value.length) model.value = model.value.slice(0, -1)
}
</script>

<template>
  <div class="tags">
    <label :for="id">{{ label }}</label>
    <div class="tags__row">
      <input
        :id="id"
        v-model="draft"
        type="text"
        placeholder="Ej: labial, mate"
        enterkeyhint="done"
        @keydown.enter.prevent="add"
        @keydown.backspace="onBackspace"
        @blur="add"
      />
      <button type="button" class="tags__add" aria-label="Agregar etiqueta" @click="add">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <ul v-if="model.length" class="tags__list">
      <li v-for="tag in model" :key="tag" class="tags__chip">
        {{ tag }}
        <button type="button" :aria-label="`Quitar etiqueta ${tag}`" @click="remove(tag)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.tags {
  &__row {
    @include flex(row, stretch, flex-start, 0.5rem);
  }

  &__add {
    flex: 0 0 46px;
    border-radius: $radius-sm;
    background: $sand;
    color: $accent;
    @include focus-ring;
  }

  &__list {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }

  &__chip {
    @include flex(row, center, flex-start, 0.1rem);
    font-size: 0.78rem;
    font-weight: 600;
    color: $accent-deep;
    background: $accent-soft;
    border-radius: $radius-pill;
    padding-left: 0.8rem;

    button {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      color: $accent-deep;
      font-size: 0.75rem;
      @include focus-ring;
    }
  }
}
</style>
