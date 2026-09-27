import APIBase from './httpBase'
import type {
  AccountType,
  AdminCustomer,
  AdminUser,
  AdminStats,
  Category,
  Order,
  OrderStatus,
  Paginated,
  Product,
  ProductImage,
  Settings,
} from '@/types'

export type ProductStatusFilter = 'published' | 'draft' | 'out'

export interface AdminProductQuery {
  q?: string
  category?: string
  status?: ProductStatusFilter | ''
  page?: number
  limit?: number
}

export interface AdminOrderQuery {
  q?: string
  status?: OrderStatus | ''
  page?: number
  limit?: number
}

export interface AdminCustomerQuery {
  q?: string
  page?: number
}

export interface AdminUserQuery {
  q?: string
  accountType?: AccountType | ''
  page?: number
}

export interface UserPayload {
  name: string
  email?: string
  phone: string
  accountType: AccountType
  isActive?: boolean
  password?: string
}

export interface ProductPayload {
  name: string
  brand: string
  category: string | null
  description: string
  price: number
  compareAtPrice: number | null
  stock: number
  isPublished: boolean
  isFeatured: boolean
  tags: string[]
  images?: ProductImage[]
}

export interface CategoryPayload {
  name: string
  description: string
  order: number
  isActive: boolean
}

/** Quita filtros vacíos para no mandar `?q=&status=` al API. */
function toQuery(params: object): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.set(key, String(value))
  })
  const text = search.toString()
  return text ? `?${text}` : ''
}

// Subir fotos desde datos móviles tarda: el timeout por defecto (15 s) se queda corto.
const UPLOAD_TIMEOUT = 120000

class AdminService extends APIBase {
  async stats(): Promise<AdminStats> {
    const { data } = await this.get<AdminStats>('admin/stats')
    return data
  }

  // Productos

  async listProducts(query: AdminProductQuery = {}): Promise<Paginated<Product>> {
    const { data } = await this.get<Paginated<Product>>(`admin/products${toQuery(query)}`)
    return data
  }

  async getProduct(id: string): Promise<Product> {
    const { data } = await this.get<Product>(`admin/products/${id}`)
    return data
  }

  async createProduct(payload: ProductPayload): Promise<Product> {
    const { data } = await this.post<Product>('admin/products', payload)
    return data
  }

  async updateProduct(id: string, payload: Partial<ProductPayload>): Promise<Product> {
    const { data } = await this.put<Product>(`admin/products/${id}`, payload)
    return data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delete<{ ok: true }>(`admin/products/${id}`)
  }

  async uploadImages(
    id: string,
    files: File[],
    onProgress?: (percent: number) => void,
  ): Promise<Product> {
    const form = new FormData()
    files.forEach((file) => form.append('images', file))
    const { data } = await this.post<Product>(`admin/products/${id}/images`, form, undefined, {
      timeout: UPLOAD_TIMEOUT,
      onUploadProgress: (event) => {
        if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100))
      },
    })
    return data
  }

  async deleteImage(id: string, image: ProductImage): Promise<Product> {
    const query = toQuery({ publicId: image.publicId, url: image.url })
    const { data } = await this.delete<Product>(`admin/products/${id}/images${query}`)
    return data
  }

  async reorderImages(id: string, images: ProductImage[]): Promise<Product> {
    const { data } = await this.put<Product>(`admin/products/${id}/images/order`, { images })
    return data
  }

  // Categorías

  async listCategories(): Promise<Category[]> {
    const { data } = await this.get<Category[]>('admin/categories')
    return data
  }

  async createCategory(payload: CategoryPayload): Promise<Category> {
    const { data } = await this.post<Category>('admin/categories', payload)
    return data
  }

  async updateCategory(id: string, payload: Partial<CategoryPayload>): Promise<Category> {
    const { data } = await this.put<Category>(`admin/categories/${id}`, payload)
    return data
  }

  async deleteCategory(id: string): Promise<void> {
    await this.delete<{ ok: true }>(`admin/categories/${id}`)
  }

  async uploadCategoryImage(id: string, file: File): Promise<Category> {
    const form = new FormData()
    form.append('image', file)
    const { data } = await this.post<Category>(`admin/categories/${id}/image`, form, undefined, {
      timeout: UPLOAD_TIMEOUT,
    })
    return data
  }

  // Pedidos

  async listOrders(query: AdminOrderQuery = {}): Promise<Paginated<Order>> {
    const { data } = await this.get<Paginated<Order>>(`admin/orders${toQuery(query)}`)
    return data
  }

  async getOrder(id: string): Promise<Order> {
    const { data } = await this.get<Order>(`admin/orders/${id}`)
    return data
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await this.patch<Order>(`admin/orders/${id}/status`, { status })
    return data
  }

  // Clientes

  async listCustomers(query: AdminCustomerQuery = {}): Promise<Paginated<AdminCustomer>> {
    const { data } = await this.get<Paginated<AdminCustomer>>(`admin/customers${toQuery(query)}`)
    return data
  }

  // Usuarios

  async listUsers(query: AdminUserQuery = {}): Promise<Paginated<AdminUser>> {
    const { data } = await this.get<Paginated<AdminUser>>(`admin/users${toQuery(query)}`)
    return data
  }

  async createUser(payload: UserPayload): Promise<AdminUser> {
    const { data } = await this.post<AdminUser>('admin/users', payload)
    return data
  }

  async updateUser(id: string, payload: Partial<UserPayload>): Promise<AdminUser> {
    const { data } = await this.patch<AdminUser>(`admin/users/${id}`, payload)
    return data
  }

  // Ajustes

  async getSettings(): Promise<Settings> {
    const { data } = await this.get<Settings>('admin/settings')
    return data
  }

  async updateSettings(settings: Settings): Promise<Settings> {
    const { data } = await this.put<Settings>('admin/settings', settings)
    return data
  }

  /** Marcas para el datalist del formulario (endpoint público). */
  async brands(): Promise<string[]> {
    const { data } = await this.get<string[]>('products/brands')
    return data
  }
}

export const adminService = new AdminService()
