import { atom, computed } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'

export interface CartItem {
  key: string
  productId: string
  slug: string
  nombre: string
  precio: number
  color?: string
  imagen?: string
  cantidad: number
}

function encode(value: CartItem[]): string {
  return JSON.stringify(value)
}

function decode(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Shared across every island on the page (product card, drawer, navbar icon) —
// persistentAtom keeps it in localStorage so the cart survives navigation and visits.
export const cartItems = persistentAtom<CartItem[]>('chagui-cart', [], { encode, decode })

export const isCartOpen = atom(false)

export function openCart() {
  isCartOpen.set(true)
}

export function closeCart() {
  isCartOpen.set(false)
}

function itemKey(productId: string, color?: string): string {
  return `${productId}::${color ?? ''}`
}

export function addToCart(item: Omit<CartItem, 'key' | 'cantidad'>, cantidad = 1): void {
  const key = itemKey(item.productId, item.color)
  const items = cartItems.get()
  const existing = items.find((i) => i.key === key)

  if (existing) {
    cartItems.set(
      items.map((i) => (i.key === key ? { ...i, cantidad: i.cantidad + cantidad } : i)),
    )
  } else {
    cartItems.set([...items, { ...item, key, cantidad }])
  }
}

export function updateQty(key: string, cantidad: number): void {
  if (cantidad < 1) {
    removeFromCart(key)
    return
  }
  cartItems.set(cartItems.get().map((i) => (i.key === key ? { ...i, cantidad } : i)))
}

export function removeFromCart(key: string): void {
  cartItems.set(cartItems.get().filter((i) => i.key !== key))
}

export function clearCart(): void {
  cartItems.set([])
}

export const cartCount = computed(cartItems, (items) =>
  items.reduce((sum, i) => sum + i.cantidad, 0),
)

export const cartTotal = computed(cartItems, (items) =>
  items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
)
