import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          nombre: string
          slug: string
          orden: number
          created_at: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          nombre: string
          precio: number
          descripcion: string
          estado: 'disponible' | 'agotado'
          destacado: boolean
          created_at: string
          updated_at: string
        }
      }
      product_categories: {
        Row: {
          product_id: string
          category_id: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          orden: number
          es_principal: boolean
          alt: string | null
          created_at: string
        }
      }
      product_colors: {
        Row: {
          id: string
          product_id: string
          nombre: string
          hex: string | null
          orden: number
        }
      }
    }
  }
}

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
