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
    descripcion: 'Imprimí documentos y trabajos, o sacá copias rápidas y a buen precio, en blanco y negro o a color.',
    accent: '#2E5C8A',
    tint: 'rgba(46,92,138,0.09)',
    servicios: [
      {
        id: 'imp-1',
        nombre: 'Impresiones',
        descripcion: 'Impresión de documentos, trabajos y más, en blanco y negro o a color.',
        icono: 'printer',
      },
      {
        id: 'imp-2',
        nombre: 'Copias',
        descripcion: 'Servicio de copias rápidas y a buen precio.',
        icono: 'copy',
      },
    ],
  },
  {
    categoria: 'Sublimación',
    titulo: 'Productos personalizados',
    descripcion: 'Personalizamos camisetas, tazas y más con el diseño o imagen que quieras. Ideal para regalos, eventos o tu negocio.',
    accent: '#C0392B',
    tint: 'rgba(192,57,43,0.09)',
    servicios: [
      {
        id: 'sub-1',
        nombre: 'Camisetas',
        descripcion: 'Sublimación de camisetas con el diseño o imagen que quieras.',
        icono: 'shirt',
      },
      {
        id: 'sub-2',
        nombre: 'Tazas',
        descripcion: 'Sublimación de tazas personalizadas para regalo o uso diario.',
        icono: 'coffee',
      },
    ],
  },
  {
    categoria: 'Diseño',
    titulo: 'Diseño gráfico a tu medida',
    descripcion: 'Diseñamos e imprimimos tarjetas de presentación, afiches y material promocional para tu negocio o evento.',
    accent: '#B87C20',
    tint: 'rgba(232,163,61,0.11)',
    servicios: [
      {
        id: 'dis-1',
        nombre: 'Tarjetas de presentación',
        descripcion: 'Diseño e impresión de tarjetas de presentación profesionales.',
        icono: 'id-card',
      },
      {
        id: 'dis-2',
        nombre: 'Afiches',
        descripcion: 'Diseño e impresión de afiches y material promocional.',
        icono: 'file-text',
      },
      {
        id: 'dis-3',
        nombre: 'Y más',
        descripcion: 'Otros trabajos de diseño gráfico bajo pedido.',
        icono: 'palette',
      },
    ],
  },
  {
    categoria: 'Fotografía',
    titulo: 'Fotografía y edición profesional',
    descripcion: 'Te acompañamos con sesiones de fotografía y editamos/retocamos tus fotos para que queden como las imaginás.',
    accent: '#4A5568',
    tint: 'rgba(74,85,104,0.08)',
    servicios: [
      {
        id: 'fot-1',
        nombre: 'Fotografías',
        descripcion: 'Servicio de fotografías para lo que necesités.',
        icono: 'camera',
      },
      {
        id: 'fot-2',
        nombre: 'Edición de fotos',
        descripcion: 'Editamos y retocamos tus fotos para que queden como las imaginás.',
        icono: 'wand',
      },
    ],
  },
]
