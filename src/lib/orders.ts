import { supabase } from './supabase'
import { site } from '../data/site'
import { formatPrice } from './format'
import type { CartItem } from './cart'

// Best-effort log to Supabase for the admin dashboard — the WhatsApp message is the
// source of truth for the actual sale, so a DB hiccup here must never block checkout.
export async function submitOrder(
  items: CartItem[],
  customerName: string,
  customerPhone: string,
  total: number,
): Promise<void> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({ customer_name: customerName, customer_phone: customerPhone, total })
      .select()
      .single()
    if (error) throw error

    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_nombre: item.nombre,
        color: item.color ?? null,
        precio_unitario: item.precio,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad,
      })),
    )
    if (itemsError) throw itemsError
  } catch (err) {
    console.error('[submitOrder] No se pudo guardar el pedido en Supabase:', err)
  }
}

export function buildWhatsAppOrderUrl(
  items: CartItem[],
  customerName: string,
  customerPhone: string,
  total: number,
): string {
  const lines = items.map(
    (item, i) =>
      `${i + 1}. ${item.nombre}${item.color ? ` (${item.color})` : ''} x${item.cantidad} — ${formatPrice(item.precio * item.cantidad)}`,
  )
  const message = [
    'Hola! Quiero hacer este pedido:',
    '',
    ...lines,
    '',
    `Total: ${formatPrice(total)}`,
    '',
    `Nombre: ${customerName}`,
    `Teléfono: ${customerPhone}`,
    '',
    `Pago por SINPE Móvil: ${site.contact.sinpe}`,
  ].join('\n')

  return `https://api.whatsapp.com/send?phone=${site.contact.whatsapp}&text=${encodeURIComponent(message)}`
}
