import { site } from '@/config/site'
import { formatMoney } from '@/utils/format'
import type { CartItem } from '@/types'

/** Pedido listo para pegar en WhatsApp: una línea por producto y el subtotal. */
export function cartWhatsappMessage(items: CartItem[], subtotal: number): string {
  const lines = items.map(
    (item) =>
      `• ${item.quantity} x ${item.name}${item.brand ? ` (${item.brand})` : ''} — ${formatMoney(item.price * item.quantity)}`,
  )
  return [
    'Hola, quiero hacer este pedido:',
    '',
    ...lines,
    '',
    `Subtotal: ${formatMoney(subtotal)}`,
    `Pedido armado en ${site.url}`,
  ].join('\n')
}
