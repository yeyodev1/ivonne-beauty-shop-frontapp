/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 */
export const site = {
  name: 'Ivonne Beauty Shop',
  shortName: 'Ivonne',
  tagline: 'Maquillaje y skincare 100% original',
  // Anuncio inicial de la barra superior; el panel lo puede cambiar y el API
  // lo reemplaza al cargar. Existe para que la barra no aparezca tarde.
  announcement: 'Maquillaje y skincare 100% original de USA · Envíos a todo Ecuador',
  description:
    'Maquillaje, skincare, perfumes y bolsos originales traídos de USA. Tienda en Machala con envíos a todo Ecuador.',
  url: 'https://dev-project-front.bakano.ec',
  email: 'admin@ivonnebeautyshop.com',
  // Solo dígitos con código de país
  whatsapp: '593992815281',
  whatsappDisplay: '099 281 5281',
  whatsappCatalog: 'https://wa.me/c/593992815281',
  canvaCatalog:
    'https://www.canva.com/design/DAGnW_DQIiM/Xx_MQdj4zM1X-yHbXwAg0A/view',
  address: {
    street: 'Junín entre Rocafuerte y Bolívar',
    reference: 'Diagonal a la Prefectura',
    city: 'Machala, El Oro, Ecuador',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Jun%C3%ADn+entre+Rocafuerte+y+Bol%C3%ADvar+Machala+Ecuador',
  },
  social: {
    instagram: 'https://www.instagram.com/ivonne.beautyshop/',
    tiktok: 'https://www.tiktok.com/@ivonnebeautyshop',
    facebook: '',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Tienda', to: '/tienda' },
    { label: 'Novedades', to: '/tienda?orden=new' },
    { label: 'Visítanos', to: '/#visitanos' },
  ],
  hero: {
    eyebrow: 'Machala · Ecuador',
    title: 'Hola bella, bienvenida',
    text: 'Maquillaje y skincare original traído de USA. Encuentra tus favoritos de Dior, YSL, Rare Beauty, e.l.f. y más, con envío a todo Ecuador.',
    primaryCta: 'Ver la tienda',
    secondaryCta: 'Escríbenos por WhatsApp',
  },
  perks: [
    { icon: 'fa-solid fa-certificate', title: '100% original', text: 'Productos auténticos traídos de USA.' },
    { icon: 'fa-solid fa-truck-fast', title: 'Envíos a todo Ecuador', text: 'Entrega en Machala y envíos nacionales.' },
    { icon: 'fa-solid fa-lock', title: 'Pago seguro', text: 'Paga con tarjeta a través de Payphone.' },
    { icon: 'fa-brands fa-whatsapp', title: 'Te asesoramos', text: 'Escríbenos y te ayudamos a elegir.' },
  ],
  about: {
    eyebrow: 'Nuestra tienda',
    title: 'Visítanos en Machala',
    text: 'Somos una tienda de maquillaje y skincare original en el centro de Machala. Ven a probar tus productos favoritos o pide por la web y te lo enviamos.',
    hours: 'Lunes a sábado',
  },
  whatsappGreeting: 'Hola, vengo de la web de Ivonne Beauty Shop',
  legal: {
    returns:
      'Por higiene, los productos de maquillaje y skincare abiertos no tienen cambio. Si tu producto llegó con algún daño, escríbenos por WhatsApp dentro de las 48 horas.',
  },
} as const

export function whatsappLink(message: string = site.whatsappGreeting): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
