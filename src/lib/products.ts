import { supabase } from './supabase'

export interface Product {
  id: string
  slug: string
  nombre: string
  precio: number
  descripcion: string
  estado: 'disponible' | 'agotado'
  colores: { nombre: string; hex: string | null }[]
  tipos: string[]
  imagenes: string[]
  destacado?: boolean
  created_at?: string
}

function mapProductRecord(record: any): Product {
  // Sort images: main first, then by orden
  const images = (record.product_images || []).sort((a: any, b: any) => {
    if (a.es_principal && !b.es_principal) return -1
    if (!a.es_principal && b.es_principal) return 1
    return (a.orden || 0) - (b.orden || 0)
  })

  // Sort colors by orden
  const colors = (record.product_colors || []).sort((a: any, b: any) => (a.orden || 0) - (b.orden || 0))

  // Extract category names
  const tipos = (record.product_categories || [])
    .map((pc: any) => pc.categories?.nombre)
    .filter(Boolean)

  return {
    id: record.id,
    slug: record.slug,
    nombre: record.nombre,
    precio: record.precio,
    descripcion: record.descripcion,
    estado: record.estado,
    destacado: record.destacado,
    created_at: record.created_at,
    colores: colors.map((c: any) => ({ nombre: c.nombre, hex: c.hex ?? null })),
    tipos: tipos,
    imagenes: images.map((i: any) => i.url),
  }
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( url, orden, es_principal ),
      product_colors ( nombre, hex, orden ),
      product_categories (
        categories ( nombre )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data || []).map(mapProductRecord)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( url, orden, es_principal ),
      product_colors ( nombre, hex, orden ),
      product_categories (
        categories ( nombre )
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return undefined
  }

  return mapProductRecord(data)
}

export async function getFeatured(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( url, orden, es_principal ),
      product_colors ( nombre, hex, orden ),
      product_categories (
        categories ( nombre )
      )
    `)
    .eq('destacado', true)
    .eq('estado', 'disponible')
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return (data || []).map(mapProductRecord)
}

export async function getRelated(product: Product, limit = 4): Promise<Product[]> {
  if (!product.tipos || product.tipos.length === 0) return []

  // First fetch the category IDs
  const { data: cats } = await supabase
    .from('categories')
    .select('id')
    .in('nombre', product.tipos)

  if (!cats || cats.length === 0) return []

  // Fetch products in those categories, excluding current one
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( url, orden, es_principal ),
      product_colors ( nombre, hex, orden ),
      product_categories!inner (
        category_id,
        categories ( nombre )
      )
    `)
    .neq('id', product.id)
    .in('product_categories.category_id', cats.map((c) => c.id))
    .limit(limit)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return (data || []).map(mapProductRecord)
}

export async function getTipos(): Promise<string[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('nombre')
    .order('orden', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data || []).map((c) => c.nombre)
}
