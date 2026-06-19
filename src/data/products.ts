export interface Product {
  id: string
  slug: string
  nombre: string
  precio: number
  descripcion: string
  estado: 'disponible' | 'agotado'
  colores: string[]
  tipos: string[]
  imagenes: string[]
  destacado?: boolean
  created_at?: string
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'lapicero-azul-3-unidades',
    nombre: 'Lapicero azul (3 unidades)',
    precio: 1500,
    descripcion:
      'Set de 3 lapiceros de tinta azul, escritura suave y de larga duración. Ideales para la escuela, la oficina o el uso diario.\n\nTinta de secado rápido, punta fina de 0.7 mm. Agarre ergonómico para escribir por horas sin cansancio.',
    estado: 'disponible',
    colores: ['Azul'],
    tipos: ['Escolar', 'Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_lapicero.jpg'],
    destacado: true,
  },
  {
    id: '2',
    slug: 'cuaderno-espiral-100-paginas',
    nombre: 'Cuaderno espiral 100 páginas',
    precio: 2200,
    descripcion:
      'Cuaderno espiral con 100 páginas de cuadros, ideal para apuntes escolares y de trabajo. Tapa dura resistente, páginas de 75 g/m².\n\nDisponible en varios colores. El espiral metálico permite abrir el cuaderno completamente plano.',
    estado: 'disponible',
    colores: ['Rojo', 'Azul', 'Verde', 'Negro'],
    tipos: ['Escolar'],
    imagenes: [
      'https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_cuaderno_rojo.jpg',
      'https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_cuaderno_azul.jpg',
      'https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_cuaderno_verde.jpg',
    ],
    destacado: true,
  },
  {
    id: '3',
    slug: 'calculadora-cientifica',
    nombre: 'Calculadora científica',
    precio: 12500,
    descripcion:
      'Calculadora científica con más de 240 funciones. Pantalla LCD de dos líneas, ideal para matemáticas, física y química.\n\nBatería de larga duración incluida. Compatible con los requerimientos escolares y universitarios.',
    estado: 'disponible',
    colores: [],
    tipos: ['Escolar', 'Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_calculadora.jpg'],
    destacado: true,
  },
  {
    id: '4',
    slug: 'resma-papel-bond-a4',
    nombre: 'Resma papel bond A4',
    precio: 6500,
    descripcion:
      'Resma de 500 hojas de papel bond tamaño A4 (21×29.7 cm), 75 g/m². Compatible con todas las impresoras y fotocopiadoras del mercado.\n\nPapel de alta blancura para impresiones nítidas en blanco y negro o a color.',
    estado: 'disponible',
    colores: [],
    tipos: ['Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_resma.jpg'],
    destacado: false,
  },
  {
    id: '5',
    slug: 'audifonos-bluetooth',
    nombre: 'Audífonos Bluetooth',
    precio: 18900,
    descripcion:
      'Audífonos inalámbricos Bluetooth 5.0 con hasta 20 horas de batería. Sonido estéreo de calidad, micrófono integrado para llamadas.\n\nDiseño plegable, cómodos para uso prolongado. Incluye cable USB-C de carga y bolso de transporte.',
    estado: 'disponible',
    colores: ['Negro', 'Blanco'],
    tipos: ['Tecnología'],
    imagenes: [
      'https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_audifonos_negro.jpg',
      'https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_audifonos_blanco.jpg',
    ],
    destacado: true,
  },
  {
    id: '6',
    slug: 'corrector-liquido',
    nombre: 'Corrector líquido',
    precio: 750,
    descripcion:
      'Corrector líquido de secado ultra rápido. Punta de pincel para aplicación precisa. No daña el papel.\n\nFórmula de base acuosa, se puede escribir encima a los 30 segundos. Botella de 20 ml.',
    estado: 'agotado',
    colores: [],
    tipos: ['Escolar', 'Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_corrector.jpg'],
    destacado: false,
  },
  {
    id: '7',
    slug: 'pegamento-en-barra-3-pack',
    nombre: 'Pegamento en barra (3 pack)',
    precio: 2000,
    descripcion:
      'Pack de 3 pegamentos en barra de 21 g cada uno. Adhesivo de fácil aplicación, no mancha y seca transparente.\n\nIdeal para trabajos escolares, manualidades y scrapbooking. Sin solventes, apto para niños.',
    estado: 'disponible',
    colores: [],
    tipos: ['Escolar'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_pegamento.jpg'],
    destacado: false,
  },
  {
    id: '8',
    slug: 'mouse-inalambrico',
    nombre: 'Mouse inalámbrico',
    precio: 9500,
    descripcion:
      'Mouse inalámbrico 2.4 GHz con receptor USB nano. Resolución de 1200 DPI, scroll suave y botones silenciosos.\n\nBatería AA incluida con duración de hasta 12 meses. Compatible con Windows, Mac y Linux.',
    estado: 'disponible',
    colores: ['Negro', 'Blanco', 'Gris'],
    tipos: ['Tecnología', 'Oficina'],
    imagenes: [
      'https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_mouse_negro.jpg',
      'https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_mouse_blanco.jpg',
    ],
    destacado: false,
  },
  {
    id: '9',
    slug: 'lapices-de-colores-12-unidades',
    nombre: 'Lápices de colores (12 unidades)',
    precio: 3200,
    descripcion:
      'Set de 12 lápices de colores vivos y de alta pigmentación. Mina resistente que no se quiebra fácilmente.\n\nIdeal para dibujo artístico, colorear y trabajos escolares. Caja resistente incluida.',
    estado: 'disponible',
    colores: [],
    tipos: ['Escolar'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_colores.jpg'],
    destacado: true,
  },
  {
    id: '10',
    slug: 'regla-plastica-30cm',
    nombre: 'Regla plástica 30 cm',
    precio: 450,
    descripcion:
      'Regla plástica transparente de 30 cm con escala en centímetros y milímetros. Bordes limpios para líneas precisas.\n\nMaterial resistente, no se dobla con el uso. Válida para escuela y dibujo técnico.',
    estado: 'disponible',
    colores: ['Transparente'],
    tipos: ['Escolar', 'Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_regla.jpg'],
    destacado: false,
  },
  {
    id: '11',
    slug: 'tijeras-escolares',
    nombre: 'Tijeras escolares',
    precio: 1200,
    descripcion:
      'Tijeras de acero inoxidable con mango ergonómico de plástico. Corte limpio y preciso para papel, cartón y tela liviana.\n\nAptas para diestros y zurdos. Tamaño ideal para mochila escolar.',
    estado: 'disponible',
    colores: ['Azul', 'Verde', 'Naranja'],
    tipos: ['Escolar'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_tijeras.jpg'],
    destacado: false,
  },
  {
    id: '12',
    slug: 'marcadores-permanentes-6-unidades',
    nombre: 'Marcadores permanentes (6 u.)',
    precio: 3800,
    descripcion:
      'Pack de 6 marcadores permanentes de colores. Tinta resistente al agua, no borra con el dedo ni el agua.\n\nIdeal para marcar cajas, carpetas, CDs y superficies no porosas. Punta media de 2 mm.',
    estado: 'disponible',
    colores: [],
    tipos: ['Escolar', 'Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_marcadores.jpg'],
    destacado: false,
  },
  {
    id: '13',
    slug: 'grapadora-metalica',
    nombre: 'Grapadora metálica',
    precio: 4800,
    descripcion:
      'Grapadora metálica capacidad para 20 hojas. Incluye 1000 grapas estándar 26/6.\n\nMecanismo anti-atasco, base antideslizante. Diseño compacto para escritorio.',
    estado: 'disponible',
    colores: ['Negro', 'Rojo'],
    tipos: ['Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_grapadora.jpg'],
    destacado: false,
  },
  {
    id: '14',
    slug: 'folder-plastico-a4-10-unidades',
    nombre: 'Folder plástico A4 (10 u.)',
    precio: 2600,
    descripcion:
      'Pack de 10 folders plásticos tamaño carta/A4 con gusanillo. Resistentes y reutilizables.\n\nProtegen documentos del polvo y la humedad. Disponibles en varios colores.',
    estado: 'disponible',
    colores: ['Transparente', 'Azul', 'Rojo', 'Verde'],
    tipos: ['Escolar', 'Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_folder.jpg'],
    destacado: false,
  },
  {
    id: '15',
    slug: 'cable-usb-c-1m',
    nombre: 'Cable USB-C 1 m',
    precio: 2800,
    descripcion:
      'Cable USB-C trenzado de 1 metro. Carga rápida hasta 60W y transferencia de datos a 480 Mbps.\n\nCompatible con la mayoría de smartphones, tablets y laptops modernos. Material duradero que no se enrolla.',
    estado: 'disponible',
    colores: ['Negro', 'Blanco'],
    tipos: ['Tecnología'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_cable_usbc.jpg'],
    destacado: false,
  },
  {
    id: '16',
    slug: 'hub-usb-4-puertos',
    nombre: 'Hub USB 4 puertos',
    precio: 8500,
    descripcion:
      'Concentrador USB 3.0 de 4 puertos. Velocidad de transferencia hasta 5 Gbps. Plug & play, sin drivers.\n\nCompatible con PC, Mac y laptops. Cable integrado de 30 cm. LED indicador de actividad.',
    estado: 'disponible',
    colores: ['Negro', 'Blanco'],
    tipos: ['Tecnología', 'Oficina'],
    imagenes: ['https://res.cloudinary.com/daqragn9m/image/upload/PLACEHOLDER_hub_usb.jpg'],
    destacado: false,
  },
]
