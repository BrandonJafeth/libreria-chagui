import { products, type Product } from '../data/products'

export type { Product }

export function getProducts(): Product[] {
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getFeatured(limit = 4): Product[] {
  return products.filter((p) => p.destacado).slice(0, limit)
}

export function getRelated(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.tipos.some((t) => product.tipos.includes(t)))
    .slice(0, limit)
}

export function getTipos(): string[] {
  return [...new Set(products.flatMap((p) => p.tipos))]
}

// ── MIGRACIÓN A SUPABASE (futuro): reemplazar el cuerpo de estas funciones por
//    consultas con @supabase/supabase-js. Las funciones pasan a ser async →
//    ajustar los await en las páginas .astro. Ningún componente de UI cambia.
