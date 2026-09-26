<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { site, whatsappLink } from '@/config/site'
import { formatMoney } from '@/utils/format'
import { useProductCart } from '@/composables/useProductCart'
import QuantityStepper from '@/components/cart/QuantityStepper.vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; discount: number }>()

const router = useRouter()
const { addToBag, inCart } = useProductCart()

const quantity = ref(1)
watch(
  () => props.product._id,
  () => (quantity.value = 1),
)

const soldOut = computed(() => props.product.stock <= 0)
const max = computed(() => Math.max(1, Math.min(props.product.stock, 20)))
const stockLabel = computed(() => {
  const { stock } = props.product
  if (stock <= 0) return 'Agotado'
  if (stock <= 3) return stock === 1 ? 'Última unidad' : `Últimas ${stock} unidades`
  return 'Disponible'
})

const whatsappHref = computed(() =>
  whatsappLink(
    `Hola, me interesa ${props.product.name}${props.product.brand ? ` de ${props.product.brand}` : ''}. ${site.url}/producto/${props.product.slug}`,
  ),
)

function add() {
  addToBag(props.product, quantity.value)
}

function buyNow() {
  // Si ya estaba en la bolsa no se duplica: se va directo a pagar.
  if (!inCart(props.product._id)) addToBag(props.product, quantity.value, false)
  if (inCart(props.product._id)) router.push('/checkout')
}
</script>

<template>
  <div class="buy">
    <div class="buy__price">
      <span class="buy__now">{{ formatMoney(product.price) }}</span>
      <s v-if="discount" class="buy__before">{{ formatMoney(product.compareAtPrice || 0) }}</s>
      <span v-if="discount" class="buy__off">Ahorras {{ discount }}%</span>
    </div>

    <p
      class="buy__stock"
      :class="{ 'buy__stock--low': product.stock > 0 && product.stock <= 3, 'buy__stock--out': soldOut }"
    >
      <i
        :class="soldOut ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle'"
        aria-hidden="true"
      ></i>
      {{ stockLabel }}
    </p>

    <div v-if="!soldOut" class="buy__row">
      <QuantityStepper v-model="quantity" :max="max" />
      <button type="button" class="btn btn--primary buy__add" @click="add">
        <i class="fa-solid fa-bag-shopping"></i> Agregar al carrito
      </button>
    </div>
    <button v-if="!soldOut" type="button" class="btn btn--dark buy__full" @click="buyNow">
      Comprar ahora
    </button>
    <a
      :href="whatsappHref"
      class="btn btn--ghost buy__full"
      target="_blank"
      rel="noopener"
    >
      <i class="fa-brands fa-whatsapp"></i>
      {{ soldOut ? 'Avísame cuando llegue' : 'Consultar por WhatsApp' }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.buy {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__price {
    @include flex(row, baseline, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__now {
    font-family: $font-display;
    font-size: $display-sm;
    font-weight: 600;
    line-height: 1;
  }

  &__before {
    color: $ink-muted;
    font-size: $text-base;
  }

  &__off {
    background: $blush;
    color: $accent-deep;
    font-size: $text-xs;
    font-weight: 700;
    padding: 0.2rem 0.65rem;
    border-radius: $radius-pill;
  }

  &__stock {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-sm;
    font-weight: 500;
    color: $success;

    i {
      font-size: 0.5rem;
    }

    &--low {
      color: $accent-deep;
      font-weight: 600;
    }

    &--out {
      color: $ink-muted;

      i {
        font-size: 0.85rem;
      }
    }
  }

  &__row {
    @include flex(row, stretch, flex-start, 0.6rem);
    margin-top: 0.3rem;
  }

  &__add {
    flex: 1;
    min-height: 50px;
    padding-inline: 1rem;
  }

  &__full {
    width: 100%;
    min-height: 50px;
  }
}
</style>
