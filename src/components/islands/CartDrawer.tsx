import { useEffect, useState } from 'react'
import { useStore } from '@nanostores/react'
import {
  cartItems,
  cartTotal,
  isCartOpen,
  closeCart,
  updateQty,
  removeFromCart,
  clearCart,
} from '../../lib/cart'
import { submitOrder, buildWhatsAppOrderUrl } from '../../lib/orders'
import { formatPrice } from '../../lib/format'
import { useMounted } from '../../lib/useMounted'
import { site } from '../../data/site'

function clImg(url: string, transforms: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/image/upload/', `/image/upload/${transforms}/`)
}

// Costa Rica local numbers are 8 digits — strip formatting and an optional +506 prefix.
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  const local = digits.length === 11 && digits.startsWith('506') ? digits.slice(3) : digits
  return local.length === 8
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    </svg>
  )
}

export default function CartDrawer() {
  const mounted = useMounted()
  const open = useStore(isCartOpen)
  const storeItems = useStore(cartItems)
  const storeTotal = useStore(cartTotal)
  const items = mounted ? storeItems : []
  const total = mounted ? storeTotal : 0

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  const [sinpeStatus, setSinpeStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  function fallbackCopy(text: string): boolean {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(textarea)
    return ok
  }

  function copySinpe() {
    function showResult(ok: boolean) {
      setSinpeStatus(ok ? 'copied' : 'error')
      setTimeout(() => setSinpeStatus('idle'), 1500)
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(site.contact.sinpe).then(
        () => showResult(true),
        () => showResult(fallbackCopy(site.contact.sinpe)),
      )
    } else {
      showResult(fallbackCopy(site.contact.sinpe))
    }
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const nameValid = customerName.trim().length > 0
  const phoneValid = isValidPhone(customerPhone)
  const canCheckout = items.length > 0 && nameValid && phoneValid

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!canCheckout) return

    const name = customerName.trim()
    const phone = customerPhone.trim()
    const orderItems = items
    const orderTotal = total
    const waUrl = buildWhatsAppOrderUrl(orderItems, name, phone, orderTotal)

    // Open the tab synchronously (in the click's call stack) so browsers don't
    // block it as a popup once we `await` the Supabase insert below.
    const win = window.open('', '_blank')
    setSubmitting(true)

    submitOrder(orderItems, name, phone, orderTotal).finally(() => {
      if (win) win.location.href = waUrl
      else window.location.href = waUrl
      clearCart()
      setCustomerName('')
      setCustomerPhone('')
      setTouched(false)
      setSubmitting(false)
      closeCart()
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className="fixed inset-0 z-[9998] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="fixed top-0 right-0 z-[9999] h-full w-full max-w-md flex flex-col bg-card shadow-2xl transition-transform"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transitionDuration: '350ms',
          transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          borderLeft: '1px solid rgba(43,43,43,0.08)',
        }}
        inert={!open}
      >
        {/* Header */}
        <div className="cuaderno-bg flex items-center justify-between px-6 py-5 border-b border-foreground/10 shrink-0">
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground leading-none">Tu carrito</h2>
            <p className="font-body text-[11px] text-foreground/45 mt-1.5 uppercase tracking-[0.1em]">
              {items.length === 0 ? 'Sin productos' : `${items.length} producto${items.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito y seguir comprando"
            className="flex items-center gap-1.5 text-foreground/60 hover:text-accent transition-colors active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="font-body text-[12px] font-semibold uppercase tracking-[0.06em]">Seguir comprando</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/20 mb-4" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="font-body text-sm text-foreground/50">Tu carrito está vacío.</p>
              <a
                href="/catalogo"
                onClick={closeCart}
                className="mt-4 font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-accent hover:opacity-70 transition-opacity"
              >
                Ver catálogo →
              </a>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <div className="w-16 h-16 shrink-0 overflow-hidden bg-background border border-foreground/10 flex items-center justify-center">
                    {item.imagen && !item.imagen.includes('PLACEHOLDER') ? (
                      <img
                        src={clImg(item.imagen, 'w_128,f_auto,q_auto,c_fill')}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-heading font-black text-xl opacity-[0.08] select-none">
                        {item.nombre.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="font-body text-sm font-medium text-foreground leading-snug truncate">{item.nombre}</p>
                      {item.color && (
                        <p className="font-body text-[11px] text-foreground/45 mt-0.5">{item.color}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center border border-foreground/15">
                        <button
                          onClick={() => updateQty(item.key, item.cantidad - 1)}
                          aria-label="Restar cantidad"
                          className="w-6 h-6 flex items-center justify-center text-foreground/55 hover:text-accent active:scale-90 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>
                        </button>
                        <span className="w-6 text-center font-body text-xs font-semibold tabular-nums select-none">{item.cantidad}</span>
                        <button
                          onClick={() => updateQty(item.key, item.cantidad + 1)}
                          aria-label="Sumar cantidad"
                          className="w-6 h-6 flex items-center justify-center text-foreground/55 hover:text-accent active:scale-90 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                      </div>
                      <span className="font-body text-sm font-semibold text-accent">{formatPrice(item.precio * item.cantidad)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.key)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                    className="w-7 h-7 shrink-0 flex items-center justify-center text-foreground/30 hover:text-accent transition-colors active:scale-90"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — totals + checkout */}
        {items.length > 0 && (
          <form onSubmit={handleCheckout} className="border-t border-foreground/10 px-6 py-5 shrink-0 bg-card/60">
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-foreground/70">Total</span>
              <span className="font-heading text-xl font-bold text-accent">{formatPrice(total)}</span>
            </div>

            <div className="flex items-center justify-between gap-3 border border-foreground/15 bg-background px-3.5 py-2.5 mb-4">
              <div>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground/45">SINPE Móvil</p>
                <p className="font-body text-sm font-semibold text-foreground tabular-nums">{site.contact.sinpe}</p>
              </div>
              <button
                type="button"
                onClick={copySinpe}
                className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-accent hover:opacity-70 transition-opacity active:scale-95 shrink-0"
              >
                {sinpeStatus === 'copied' ? 'Copiado' : sinpeStatus === 'error' ? 'No se pudo' : 'Copiar'}
              </button>
            </div>

            <div className="flex flex-col gap-2.5 mb-4">
              <input
                type="text"
                placeholder="Tu nombre"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full border border-foreground/15 bg-background px-3.5 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/35"
                aria-invalid={touched && !nameValid}
              />
              <input
                type="tel"
                placeholder="Tu teléfono (8 dígitos)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full border border-foreground/15 bg-background px-3.5 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/35"
                aria-invalid={touched && !phoneValid}
              />
              {touched && !nameValid && (
                <p className="font-body text-xs" style={{ color: 'hsl(6 63% 46%)' }}>
                  Completá tu nombre para enviar el pedido.
                </p>
              )}
              {touched && nameValid && !phoneValid && (
                <p className="font-body text-xs" style={{ color: 'hsl(6 63% 46%)' }}>
                  Ingresá un teléfono válido de 8 dígitos.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !canCheckout}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white font-body font-bold text-[13px] uppercase tracking-[1.2px] px-6 py-3.5 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {submitting ? 'Enviando…' : 'Enviar pedido por WhatsApp'}
            </button>
          </form>
        )}
      </aside>
    </>
  )
}
