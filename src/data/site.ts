export const site = {
  name: 'Librería y Bazar Chagui',
  domain: 'https://libreriafchagui.com',
  description:
    'Librería y Bazar Chagui en Hatillo, San José. Útiles escolares, artículos de oficina y tecnología. Servicios de impresión, copias, sublimación, diseño y fotografía. Diagonal al C.C. Plaza América.',
  logo: 'https://res.cloudinary.com/daqragn9m/image/upload/v1781916229/logo-libreria-chagui-png-removebg-preview_anqdcg.png',
  nav: [
    { label: 'Inicio',         href: '/' },
    { label: 'Catálogo',       href: '/catalogo' },
    { label: 'Servicios',      href: '/servicios' },
    { label: 'Sobre nosotros', href: '/sobre-nosotros' },
    { label: 'Contacto',       href: '/contacto' },
  ],
  cta: {
    label: 'WhatsApp',
    href: 'https://api.whatsapp.com/send?phone=50663595383&text=Hola%20buenas%2C%20era%20para%20realizar%20una%20consulta',
  },
  contact: {
    phone: '+506 6359 5383',
    phone2: '+506 4080 7942',
    whatsapp: '50663595383',
    address: 'Hatillo, de la rotonda 75 metros norte, mano derecha — diagonal al C.C. Plaza América',
    whatsappBase:
      'https://api.whatsapp.com/send?phone=50663595383&text=Hola%20buenas%2C%20era%20para%20realizar%20una%20consulta',
    mapsUrl:
      'https://maps.google.com/?q=9.911819990189127,-84.10121512520762',
  },
  hours: {
    weekdays: { open: '8:00', close: '19:00', label: 'Lun–Vie: 8 a. m. – 7 p. m.' },
    saturday: { open: '9:00', close: '18:00', label: 'Sáb: 9 a. m. – 6 p. m.' },
    sunday:   { label: 'Dom: Cerrado' },
  },
  social: {
    instagram: 'https://www.instagram.com/libreria_chagui/',
    facebook:  'https://www.facebook.com/isaias.chagui.7/',
    tiktok:    'https://www.tiktok.com/@libreria.chagui',
  },
}
