import { useCartStore, itemKey } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import { cartKey } from '@/utils/format'
import type { Product, ProductShade } from '@/types'

/** Agregar a la bolsa se ve igual desde cualquier lado: toast + drawer abierto. */
export function useProductCart() {
  const cart = useCartStore()
  const toast = useToastStore()

  function inCart(productId: string, shadeId = ''): number {
    const key = cartKey(productId, shadeId)
    return cart.items.find((i) => itemKey(i) === key)?.quantity || 0
  }

  function addToBag(
    product: Product,
    quantity = 1,
    openDrawer = true,
    shade: ProductShade | null = null,
  ): boolean {
    // Sin tono elegido no se agrega: a una base en el tono equivocado no se le puede dar uso.
    if (product.shades?.length && !shade) {
      toast.info(site.shades.chooseFirst)
      return false
    }
    const stock = shade ? (shade.isActive ? shade.stock : 0) : product.stock
    const label = shade ? `${product.name} en tono ${shade.name}` : product.name
    if (stock <= 0) {
      toast.info(shade ? `El tono ${shade.name} está agotado` : 'Este producto está agotado')
      return false
    }
    const before = inCart(product._id, shade?._id)
    cart.add(product, quantity, shade)
    if (inCart(product._id, shade?._id) === before) {
      toast.info(`Ya tienes todas las unidades disponibles de ${label}`)
      return false
    }
    toast.success('Agregado a tu bolsa')
    if (openDrawer) cart.openDrawer()
    return true
  }

  return { addToBag, inCart }
}
