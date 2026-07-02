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
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
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
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      product_categories: {
        Row: {
          product_id: string
          category_id: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
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
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      product_colors: {
        Row: {
          id: string
          product_id: string
          nombre: string
          hex: string | null
          orden: number
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          notes: string | null
          total: number
          status: 'pendiente' | 'confirmado' | 'cancelado'
          created_at: string
        }
        Insert: {
          customer_name: string
          customer_phone: string
          notes?: string | null
          total: number
        }
        Update: Record<string, unknown>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_nombre: string
          color: string | null
          precio_unitario: number
          cantidad: number
          subtotal: number
        }
        Insert: {
          order_id: string
          product_id?: string | null
          product_nombre: string
          color?: string | null
          precio_unitario: number
          cantidad: number
          subtotal: number
        }
        Update: Record<string, unknown>
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          author_name: string
          rating: number
          comment: string | null
          approved: boolean
          created_at: string
        }
        Insert: {
          product_id: string
          author_name: string
          rating: number
          comment?: string | null
        }
        Update: {
          approved?: boolean
        }
      }
    }
  }
}

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL as string,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string
)
