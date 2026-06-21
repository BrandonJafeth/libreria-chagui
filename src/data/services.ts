export interface Service {
  id: string
  nombre: string
  descripcion: string
  icono: string
}

export interface ServiceGroup {
  categoria: string
  /** Título corto para el panel destacado del tab, ej. "Productos personalizados" (opcional). */
  titulo?: string
  /** Descripción corta para el panel destacado del tab (opcional). */
  descripcion?: string
  /** Color de acento de la categoría, ej. '#2E5C8A' (opcional, hay fallback en ServicesGrid). */
  accent?: string
  /** Tint/fondo suave del acento, ej. 'rgba(46,92,138,0.09)' (opcional). */
  tint?: string
  servicios: Service[]
}

export const serviceGroups: ServiceGroup[] = [
  {
    categoria: 'Impresión',
    titulo: 'Impresiones y copias al instante',
    descripcion: 'Imprimí documentos, tareas y trabajos en blanco y negro o a color. También sacamos copias rápidas a buen precio. Atención inmediata, sin filas ni esperas.',
    accent: '#2E5C8A',
    tint: 'rgba(46,92,138,0.09)',
    servicios: [
      {
        id: 'imp-1',
        nombre: 'Impresiones',
        descripcion: 'Imprimimos documentos, tareas, trabajos universitarios, formularios y cualquier archivo que nos traigás en USB o por WhatsApp. Disponible en blanco y negro o a color, en tamaños carta, oficio y más. B&N desde ₡50, color desde ₡100. Descuento por volumen en trabajos grandes.',
        icono: 'printer',
      },
      {
        id: 'imp-2',
        nombre: 'Copias',
        descripcion: 'Fotocopias rápidas a precios accesibles. Traé tu original y te hacemos las copias al instante, en blanco y negro o a color. Ideal para documentos, contratos, tareas o cualquier papel que necesités duplicar. Precios que no duelen.',
        icono: 'copy',
      },
    ],
  },
  {
    categoria: 'Sublimación',
    titulo: 'Productos personalizados',
    descripcion: 'Personalizamos camisetas, tazas y más con el diseño o imagen que quieras. Ideal para regalos originales, uniformes de equipo, recuerdos de eventos o promoción de tu negocio.',
    accent: '#C0392B',
    tint: 'rgba(192,57,43,0.09)',
    servicios: [
      {
        id: 'sub-1',
        nombre: 'Camisetas',
        descripcion: 'Personalizamos camisetas con sublimación de alta calidad — el diseño se funde con la tela y no se pela ni desvanece con los lavados. Traé tu diseño o te ayudamos a crearlo. Perfectas para uniformes de equipo, grupos, eventos familiares o para regalar algo único.',
        icono: 'shirt',
      },
      {
        id: 'sub-2',
        nombre: 'Tazas',
        descripcion: 'Tazas personalizadas con la foto, frase o diseño que quieras. Resultado de alta definición y colores vibrantes que aguantan el lavavajillas. El regalo perfecto para cumpleaños, día de la madre, del padre, o simplemente para uso diario. También disponibles en pedidos por mayor.',
        icono: 'coffee',
      },
    ],
  },
  {
    categoria: 'Diseño',
    titulo: 'Diseño gráfico a tu medida',
    descripcion: 'Creamos piezas gráficas profesionales para que tu negocio o evento cause impacto. Desde tarjetas de presentación hasta afiches y material promocional. Solo decinos qué necesitás.',
    accent: '#B87C20',
    tint: 'rgba(232,163,61,0.11)',
    servicios: [
      {
        id: 'dis-1',
        nombre: 'Tarjetas de presentación',
        descripcion: 'Diseñamos e imprimimos tarjetas de presentación que realmente representan tu negocio. Podés traer tu propio diseño o nosotros lo creamos desde cero. Acabado profesional, papel de calidad y entrega rápida. Primera impresión que no se olvida.',
        icono: 'id-card',
      },
      {
        id: 'dis-2',
        nombre: 'Afiches y volantes',
        descripcion: 'Afiches, flyers y volantes diseñados e impresos para promocionar tu negocio, evento, venta o actividad. Disponibles en diferentes tamaños y acabados. Llevás tu diseño o lo hacemos nosotros. Entrega el mismo día en pedidos pequeños.',
        icono: 'file-text',
      },
      {
        id: 'dis-3',
        nombre: 'Diseño personalizado',
        descripcion: 'También hacemos banners, brochures, invitaciones, etiquetas, logos y cualquier pieza gráfica que necesités. Trabajamos con vos para que el resultado sea exactamente lo que tenías en mente. Consultá sin compromiso por WhatsApp.',
        icono: 'palette',
      },
    ],
  },
  {
    categoria: 'Fotografía',
    titulo: 'Fotografía e impresión profesional',
    descripcion: 'Fotos para pasaporte, visa e impresión fotográfica en papel de alta calidad. También editamos y retocamos tus fotos para que queden tal como las imaginás.',
    accent: '#4A5568',
    tint: 'rgba(74,85,104,0.08)',
    servicios: [
      {
        id: 'fot-1',
        nombre: 'Fotos Pasaporte y Visa',
        descripcion: 'Tomamos y revelamos fotos para pasaporte, visa americana, visa Schengen y cualquier documento oficial. Cumplimos con todos los requisitos de tamaño, fondo y calidad exigidos. Salís con las fotos listas el mismo día, sin citas ni demoras. También aceptamos fotos digitales propias si solo necesitás el revelado.',
        icono: 'camera',
      },
      {
        id: 'fot-2',
        nombre: 'Impresión fotográfica',
        descripcion: 'Imprimimos tus fotografías en papel fotográfico de alta calidad con colores vivos y acabado duradero. Disponible en los tamaños más comunes: 4×6, 5×7, 8×10 y más bajo pedido. Ideal para recuerdos, decoración, álbumes o para enmarcar. Traé el archivo digital y nosotros lo imprimimos.',
        icono: 'image',
      },
      {
        id: 'fot-3',
        nombre: 'Edición de fotos',
        descripcion: 'Retocamos, corregimos colores, eliminamos fondos, mejoramos iluminación y aplicamos los ajustes que necesités en tus fotografías. Servicio útil para fotos de perfil, documentos, recuerdos familiares o imágenes para redes sociales. Resultado profesional sin tener que descargar nada.',
        icono: 'wand',
      },
    ],
  },
]
