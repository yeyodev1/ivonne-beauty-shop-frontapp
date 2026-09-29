const money = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

/** El API trabaja en centavos: formatMoney(1990) → "$19,90". */
export function formatMoney(cents: number): string {
  return money.format((cents || 0) / 100)
}

/** Para inputs del admin: 1990 → "19.90". */
export function centsToInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return ''
  return (cents / 100).toFixed(2)
}

/** "19,90" o "19.90" → 1990. Vacío o inválido → null. */
export function inputToCents(value: string | number): number | null {
  const text = String(value ?? '')
    .trim()
    .replace(',', '.')
  if (!text) return null
  const number = Number(text)
  return Number.isFinite(number) ? Math.round(number * 100) : null
}

const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string | Date): string {
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(value: string | Date): string {
  return dateTime.format(typeof value === 'string' ? new Date(value) : value)
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente de pago',
  paid: 'Pagado',
  preparing: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  canceled: 'Cancelado',
}

/** Primera imagen del producto o un placeholder de marca. */
export function productCover(images: Array<{ url: string }> | undefined): string {
  return images?.[0]?.url || '/placeholder-product.svg'
}

/** Una línea del carrito es producto + tono: el mismo labial en dos tonos son dos líneas. */
export function cartKey(productId: string, shadeId = ''): string {
  return shadeId ? `${productId}:${shadeId}` : productId
}
