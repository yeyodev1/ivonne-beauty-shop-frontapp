/**
 * Enlaces de contacto con clientas desde el panel.
 *
 * Los celulares llegan como los escribió la clienta ("099 123 4567",
 * "+593 99...", "0991234567"): se normalizan a 5939XXXXXXXX para wa.me.
 */
export function toWhatsappNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('593')) return digits
  if (digits.startsWith('0')) return `593${digits.slice(1)}`
  if (digits.length === 9 && digits.startsWith('9')) return `593${digits}`
  return digits
}

export function adminWhatsappLink(phone: string, message = ''): string {
  const number = toWhatsappNumber(phone)
  if (!number) return ''
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}

export function telLink(phone: string): string {
  const clean = (phone || '').replace(/[^\d+]/g, '')
  return clean ? `tel:${clean}` : ''
}

export function orderWhatsappMessage(name: string, number: string): string {
  const first = (name || '').trim().split(/\s+/)[0] || ''
  return `Hola ${first}, te escribimos de Ivonne Beauty Shop por tu pedido ${number}`
}
