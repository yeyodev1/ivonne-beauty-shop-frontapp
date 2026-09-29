import { defineStore } from 'pinia'
import { cartKey } from '@/utils/format'
import type { CartItem, Product, ProductShade } from '@/types'

const CART_KEY = 'ivonne_cart'
const MAX_PER_ITEM = 20

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function save(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    // Modo privado: el carrito vive lo que dure la pestaña.
  }
}

export function itemKey(item: CartItem): string {
  return cartKey(item.productId, item.shadeId)
}

/**
 * El carrito guarda precios solo para pintar. El total que se cobra lo
 * recalcula el backend al crear el pedido.
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: load(),
    drawerOpen: false,
  }),

  getters: {
    count: (s) => s.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: (s) => s.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    isEmpty: (s) => s.items.length === 0,
  },

  actions: {
    add(product: Product, quantity = 1, shade: ProductShade | null = null) {
      const stock = shade ? shade.stock : product.stock
      const limit = Math.min(stock, MAX_PER_ITEM)
      const key = cartKey(product._id, shade?._id)
      const existing = this.items.find((item) => itemKey(item) === key)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, limit)
        existing.stock = stock
        existing.price = product.price
      } else {
        this.items.push({
          productId: product._id,
          shadeId: shade?._id || '',
          shadeName: shade?.name || '',
          shadeColor: shade?.color || '',
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          image: product.images[0]?.url || '',
          price: product.price,
          stock,
          quantity: Math.min(quantity, limit),
        })
      }
      save(this.items)
    },

    setQuantity(key: string, quantity: number) {
      const item = this.items.find((i) => itemKey(i) === key)
      if (!item) return
      if (quantity <= 0) {
        this.remove(key)
        return
      }
      item.quantity = Math.min(quantity, item.stock, MAX_PER_ITEM)
      save(this.items)
    },

    remove(key: string) {
      this.items = this.items.filter((i) => itemKey(i) !== key)
      save(this.items)
    },

    clear() {
      this.items = []
      save(this.items)
    },

    openDrawer() {
      this.drawerOpen = true
    },

    closeDrawer() {
      this.drawerOpen = false
    },
  },
})
