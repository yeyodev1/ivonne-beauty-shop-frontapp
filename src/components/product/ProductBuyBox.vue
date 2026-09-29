<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { site, whatsappLink } from '@/config/site'
import { formatMoney } from '@/utils/format'
import { useProductCart } from '@/composables/useProductCart'
import QuantityStepper from '@/components/cart/QuantityStepper.vue'
import ProductShadePicker from './ProductShadePicker.vue'
import type { Product, ProductShade } from '@/types'

const props = defineProps<{ product: Product; discount: number; shade: ProductShade | null }>()
const shadeId = defineModel<string>('shadeId', { required: true })

const router = useRouter()
const { addToBag, inCart } = useProductCart()

const quantity = ref(1)
watch(
  () => [props.product._id, shadeId.value],
  () => (quantity.value = 1),
)

const hasShades = computed(() => props.product.shades?.length > 0)
// Con tonos, el stock que manda es el del tono elegido; sin elegir, el total del producto.
const stock = computed(() => (props.shade ? props.shade.stock : props.product.stock))
const soldOut = computed(() => stock.value <= 0)
const needsShade = computed(() => hasShades.value && !props.shade)
const max = computed(() => Math.max(1, Math.min(stock.value, 20)))
const stockLabel = computed(() => {
  if (stock.value <= 0) return props.shade ? `Tono ${props.shade.name} agotado` : 'Agotado'
  if (needsShade.value) return 'Disponible en varios tonos'
  if (stock.value <= 3) return stock.value === 1 ? 'Última unidad' : `Últimas ${stock.value} unidades`
  return 'Disponible'
})

const whatsappHref = computed(() => {
  const { name, brand, slug } = props.product
  const tone = props.shade ? ` en tono ${props.shade.name}` : ''
  return whatsappLink(
    `Hola, me interesa ${name}${brand ? ` de ${brand}` : ''}${tone}. ${site.url}/producto/${slug}`,
  )
})

function focusPicker() {
  document.getElementById('tonos')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function add() {
  if (needsShade.value) return focusPicker()
  addToBag(props.product, quantity.value, true, props.shade)
}

function buyNow() {
  if (needsShade.value) return focusPicker()
  // Si ya estaba en la bolsa no se duplica: se va directo a pagar.
  const id = props.shade?._id
  if (!inCart(props.product._id, id)) addToBag(props.product, quantity.value, false, props.shade)
  if (inCart(props.product._id, id)) router.push('/checkout')
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
      :class="{ 'buy__stock--low': !needsShade && stock > 0 && stock <= 3, 'buy__stock--out': soldOut }"
    >
      <i
        :class="soldOut ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle'"
        aria-hidden="true"
      ></i>
      {{ stockLabel }}
    </p>

    <ProductShadePicker v-if="hasShades" v-model="shadeId" :shades="product.shades" />

    <div v-if="!soldOut" class="buy__row">
      <QuantityStepper v-model="quantity" :max="max" />
      <button type="button" class="btn btn--primary buy__add" @click="add">
        <template v-if="needsShade">{{ site.shades.choose }}</template>
        <template v-else><i class="fa-solid fa-bag-shopping"></i> Agregar al carrito</template>
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
