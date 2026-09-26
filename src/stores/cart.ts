import { defineStore } from 'pinia'
import type { CartItem, Product } from '@/types'

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
    add(product: Product, quantity = 1) {
      const limit = Math.min(product.stock, MAX_PER_ITEM)
      const existing = this.items.find((item) => item.productId === product._id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, limit)
        existing.stock = product.stock
        existing.price = product.price
      } else {
        this.items.push({
          productId: product._id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          image: product.images[0]?.url || '',
          price: product.price,
          stock: product.stock,
          quantity: Math.min(quantity, limit),
        })
      }
      save(this.items)
    },

    setQuantity(productId: string, quantity: number) {
      const item = this.items.find((i) => i.productId === productId)
      if (!item) return
      if (quantity <= 0) {
        this.remove(productId)
        return
      }
      item.quantity = Math.min(quantity, item.stock, MAX_PER_ITEM)
      save(this.items)
    },

    remove(productId: string) {
      this.items = this.items.filter((i) => i.productId !== productId)
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
