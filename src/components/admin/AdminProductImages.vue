<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useAdminProductImages } from '@/composables/useAdminProductImages'
import type { Product, ProductImage } from '@/types'

const props = defineProps<{ productId: string; images: ProductImage[]; name: string }>()
const emit = defineEmits<{ change: [product: Product] }>()

const { pending, progress, uploading, uploadError, busyUrl, upload, remove, makeCover, addByUrl } =
  useAdminProductImages(toRef(props, 'productId'), (product) => emit('change', product))

const gallery = ref<HTMLInputElement | null>(null)
const camera = ref<HTMLInputElement | null>(null)
const urlOpen = ref(false)
const url = ref('')

function onFiles(event: Event) {
  const target = event.target as HTMLInputElement
  upload(target.files)
  // Permite volver a elegir el mismo archivo si falló
  target.value = ''
}

async function submitUrl() {
  if (await addByUrl(props.images, url.value)) {
    url.value = ''
    urlOpen.value = false
  }
}
</script>

<template>
  <div class="imgs">
    <p v-if="uploadError" class="imgs__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
      {{ uploadError }}
    </p>

    <ul class="imgs__grid">
      <li v-for="(image, index) in images" :key="image.url" class="imgs__item" :class="{ 'imgs__item--busy': busyUrl === image.url }">
        <img :src="image.url" :alt="`${name}, foto ${index + 1}`" loading="lazy" />
        <span v-if="index === 0" class="imgs__badge">Portada</span>
        <div class="imgs__actions">
          <button
            v-if="index > 0"
            type="button"
            class="imgs__btn"
            aria-label="Usar como portada"
            :disabled="Boolean(busyUrl)"
            @click="makeCover(images, image)"
          >
            <i class="fa-solid fa-star"></i>
          </button>
          <button
            type="button"
            class="imgs__btn imgs__btn--danger"
            aria-label="Eliminar foto"
            :disabled="Boolean(busyUrl)"
            @click="remove(image)"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>
      <li v-for="item in pending" :key="item.key" class="imgs__item imgs__item--pending">
        <img :src="item.preview" :alt="`Subiendo ${item.name}`" />
      </li>
      <li class="imgs__item imgs__item--add">
        <button type="button" class="imgs__pick" :disabled="uploading" @click="gallery?.click()">
          <i class="fa-solid fa-images" aria-hidden="true"></i>
          <span>{{ uploading ? 'Subiendo…' : 'Galería' }}</span>
        </button>
      </li>
      <li class="imgs__item imgs__item--add">
        <button type="button" class="imgs__pick" :disabled="uploading" @click="camera?.click()">
          <i class="fa-solid fa-camera" aria-hidden="true"></i>
          <span>Cámara</span>
        </button>
      </li>
    </ul>

    <div v-if="uploading" class="imgs__progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
      <span :style="{ width: `${progress}%` }"></span>
    </div>

    <!-- Dos entradas: con capture Android abre directo la cámara y no deja elegir de la galería -->
    <input
      ref="gallery"
      class="visually-hidden"
      type="file"
      accept="image/*"
      multiple
      tabindex="-1"
      aria-label="Elegir fotos de la galería"
      @change="onFiles"
    />
    <input
      ref="camera"
      class="visually-hidden"
      type="file"
      accept="image/*"
      multiple
      capture="environment"
      tabindex="-1"
      aria-label="Tomar foto con la cámara"
      @change="onFiles"
    />

    <button v-if="!urlOpen" type="button" class="imgs__link" @click="urlOpen = true">
      <i class="fa-solid fa-link" aria-hidden="true"></i> Agregar imagen por URL
    </button>
    <form v-else class="imgs__url" @submit.prevent="submitUrl">
      <label class="visually-hidden" for="image-url">URL de la imagen</label>
      <input id="image-url" v-model="url" type="url" inputmode="url" placeholder="https://..." />
      <button type="submit" class="btn btn--dark" :disabled="!url || Boolean(busyUrl)">Agregar</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.imgs {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__error {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    border-radius: $radius-sm;
    padding: 0.75rem 0.9rem;
    line-height: 1.45;

    i {
      margin-top: 0.2rem;
    }
  }

  // Columnas fijas (3 / 4 / 5) para que la última foto no se estire a lo ancho
  &__grid {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__item {
    flex: 0 0 calc((100% - 1rem) / 3);
    position: relative;
    aspect-ratio: 1;

    @include from('md') {
      flex-basis: calc((100% - 1.5rem) / 4);
    }

    @include from('lg') {
      flex-basis: calc((100% - 2rem) / 5);
    }

    border-radius: 12px;
    overflow: hidden;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--busy,
    &--pending {
      opacity: 0.55;
    }

    &--add {
      border: 1.5px dashed $blush;
      background: $paper;
    }
  }

  &__badge {
    position: absolute;
    left: 0.35rem;
    top: 0.35rem;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $surface;
    background: $accent;
    border-radius: $radius-pill;
    padding: 0.25rem 0.5rem;
  }

  &__actions {
    position: absolute;
    right: 0.25rem;
    bottom: 0.25rem;
    @include flex(row, center, flex-end, 0.25rem);
  }

  &__btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba($surface, 0.92);
    color: $warning;
    font-size: 0.8rem;
    box-shadow: $shadow-sm;
    @include focus-ring;

    &--danger {
      color: $danger;
    }
  }

  &__pick {
    width: 100%;
    height: 100%;
    @include flex(column, center, center, 0.35rem);
    color: $accent;
    font-size: 0.72rem;
    font-weight: 600;
    @include focus-ring;

    i {
      font-size: 1.3rem;
    }
  }

  &__progress {
    height: 6px;
    border-radius: 6px;
    background: $sand;
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      background: $accent;
      @include transition(width);
    }
  }

  &__link {
    align-self: flex-start;
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    @include focus-ring;
  }

  &__url {
    @include flex(row, stretch, flex-start, 0.5rem);

    .btn {
      flex: 0 0 auto;
      padding-inline: 1.1rem;
    }
  }
}
</style>
