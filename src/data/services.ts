export interface Service {
  id: string
  nombre: string
  descripcion: string
  icono: string
}

export interface ServiceGroup {
  categoria: string
  servicios: Service[]
}

export const serviceGroups: ServiceGroup[] = [
  {
    categoria: 'Impresión',
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
