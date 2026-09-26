import APIBase from './httpBase'
import type { CreateOrderPayload, Order, PayphoneConfig, Settings } from '@/types'

class OrderService extends APIBase {
  /** Crea la orden en `pending` y trae lo necesario para montar la Cajita. */
  async createOrder(payload: CreateOrderPayload): Promise<{ order: Order; payphone: PayphoneConfig }> {
    const { data } = await this.post<{ order: Order; payphone: PayphoneConfig }>('orders', payload)
    return data
  }

  /**
   * Payphone reversa el cobro si no se confirma en 5 minutos: esta llamada va
   * apenas carga la página de respuesta. Timeout más holgado porque el backend
   * a su vez consulta a Payphone.
   */
  async confirm(id: number, clientTransactionId: string): Promise<{ order: Order }> {
    const { data } = await this.post<{ order: Order }>(
      'orders/confirm',
      { id, clientTransactionId },
      undefined,
      { timeout: 30000 },
    )
    return data
  }

  async mine(): Promise<Order[]> {
    const { data } = await this.get<Order[]>('orders/mine')
    return data
  }

  async byTransaction(clientTransactionId: string): Promise<{ order: Order }> {
    const { data } = await this.get<{ order: Order }>(
      `orders/by-transaction/${encodeURIComponent(clientTransactionId)}`,
    )
    return data
  }

  /** Opciones de envío activas para el checkout. */
  async getSettings(): Promise<Settings> {
    const { data } = await this.get<Settings>('settings')
    return data
  }
}

export const orderService = new OrderService()
