import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import type { Product } from '@/types'

/** Agregar a la bolsa se ve igual desde cualquier lado: toast + drawer abierto. */
export function useProductCart() {
  const cart = useCartStore()
  const toast = useToastStore()

  function inCart(productId: string): number {
    return cart.items.find((i) => i.productId === productId)?.quantity || 0
  }

  function addToBag(product: Product, quantity = 1, openDrawer = true): boolean {
    if (product.stock <= 0) {
      toast.info('Este producto está agotado')
      return false
    }
    const before = inCart(product._id)
    cart.add(product, quantity)
    if (inCart(product._id) === before) {
      toast.info(`Ya tienes todas las unidades disponibles de ${product.name}`)
      return false
    }
    toast.success('Agregado a tu bolsa')
    if (openDrawer) cart.openDrawer()
    return true
  }

  return { addToBag, inCart }
}
