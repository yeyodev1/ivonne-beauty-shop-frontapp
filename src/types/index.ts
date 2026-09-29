/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// Todos los montos llegan en centavos: $19.90 → 1990.

export interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  order: number
  isActive: boolean
  productCount?: number
}

export interface ProductImage {
  url: string
  // '' cuando la imagen es una URL externa y no vive en Cloudinary
  publicId: string
}

export interface ProductShade {
  // Sin _id mientras el admin no guarda un tono recién agregado
  _id?: string
  name: string
  // Hex (#c68b6e) para la muestra; '' si no se definió
  color: string
  stock: number
  // false = bloqueado a mano aunque quede stock
  isActive: boolean
}

export interface Product {
  _id: string
  name: string
  slug: string
  brand: string
  category: Category | string | null
  description: string
  price: number
  compareAtPrice: number | null
  images: ProductImage[]
  shades: ProductShade[]
  // Con tonos, es la suma del stock de los tonos activos
  stock: number
  isPublished: boolean
  isFeatured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductQuery {
  category?: string
  q?: string
  brand?: string
  featured?: boolean
  sort?: 'new' | 'price-asc' | 'price-desc' | 'name'
  page?: number
  limit?: number
}

export interface ShippingOption {
  id: string
  label: string
  description: string
  price: number
  enabled: boolean
}

export interface Settings {
  shippingOptions: ShippingOption[]
  announcement: string
}

export interface OrderItem {
  product: string
  name: string
  slug: string
  brand: string
  image: string
  price: number
  quantity: number
  shade?: { id: string; name: string; color: string } | null
}

export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'canceled'

export interface OrderCustomer {
  name: string
  email: string
  phone: string
  documentId: string
}

export interface OrderAddress {
  city: string
  street: string
  reference: string
}

export interface Order {
  _id: string
  number: string
  user: string | null
  customer: OrderCustomer
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  shipping: { optionId: string; label: string }
  address: OrderAddress
  notes: string
  clientTransactionId: string
  status: OrderStatus
  paidAt: string | null
  createdAt: string
  updatedAt: string
  payphone?: unknown
}

export interface CreateOrderPayload {
  items: Array<{ productId: string; shadeId?: string; quantity: number }>
  customer: OrderCustomer
  shippingOptionId: string
  address: OrderAddress
  notes?: string
}

/** Lo que el backend entrega para montar la Cajita de Pagos. */
export interface PayphoneConfig {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  reference: string
}

export interface AdminStats {
  ordersToday: number
  pendingOrders: number
  paidOrdersMonth: number
  salesMonth: number
  products: number
  publishedProducts: number
  lowStock: number
  customers: number
  recentOrders: Order[]
}

export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
  ordersCount: number
  totalSpent: number
}

export type AccountType = 'customer' | 'admin'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  accountType: AccountType
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

/** Línea del carrito: copia mínima del producto para pintar sin pedir al API. */
export interface CartItem {
  productId: string
  // '' en productos sin tonos (y en carritos guardados antes de que existieran)
  shadeId?: string
  shadeName?: string
  shadeColor?: string
  slug: string
  name: string
  brand: string
  image: string
  price: number
  stock: number
  quantity: number
}
