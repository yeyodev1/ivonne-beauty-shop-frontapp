import APIBase from './httpBase'
import type { Category, Paginated, Product, ProductQuery, Settings } from '@/types'

/** Arma el query string sin mandar claves vacías. */
function toQuery(query: ProductQuery): string {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === false) return
    params.set(key, String(value))
  })
  const text = params.toString()
  return text ? `?${text}` : ''
}

class CatalogService extends APIBase {
  async getCategories(): Promise<Category[]> {
    const { data } = await this.get<Category[]>('categories')
    return data
  }

  async getProducts(query: ProductQuery = {}): Promise<Paginated<Product>> {
    const { data } = await this.get<Paginated<Product>>(`products${toQuery(query)}`)
    return data
  }

  async getBrands(): Promise<string[]> {
    const { data } = await this.get<string[]>('products/brands')
    return data
  }

  async getProduct(slug: string): Promise<{ product: Product; related: Product[] }> {
    const { data } = await this.get<{ product: Product; related: Product[] }>(
      `products/${encodeURIComponent(slug)}`,
    )
    return data
  }

  async getSettings(): Promise<Settings> {
    const { data } = await this.get<Settings>('settings')
    return data
  }
}

export const catalogService = new CatalogService()
