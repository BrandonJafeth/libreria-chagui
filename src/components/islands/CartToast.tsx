import { useEffect, useState } from 'react'
import { useStore } from '@nanostores/react'
import { toastItem, hideToast, openCart, TOAST_DURATION } from '../../lib/cart'
import { formatPrice } from '../../lib/format'
import { clImg } from '../../lib/cloudinary'
import { useMounted } from '../../lib/useMounted'

export default function CartToast() {
  const mounted = useMounted()
  const item = useStore(toastItem)
  const [renderKey, setRenderKey] = useState(0)

  useEffect(() => {
    if (item) setRenderKey((k) => k + 1)
  }, [item])

  useEffect(() => {
    if (!item) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') hideToast()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [item])

  if (!mounted || !item) return null

  function handleViewCart() {
    hideToast()
    openCart()
  }

  return (
    <>
      <div
        onClick={hideToast}
        aria-hidden="true"
        className="fixed inset-0 z-[9998] bg-foreground/20 backdrop-blur-[2px]"
      />
      <div
        key={renderKey}
        role="status"
        aria-live="polite"
        className="toast-in fixed top-1/2 left-1/2 z-[9999] w-[calc(100%-2.5rem)] max-w-[380px] -translate-x-1/2 -translate-y-1/2 bg-card shadow-2xl overflow-hidden"
      >
        <button
          type="button"
          onClick={hideToast}
          aria-label="Cerrar"
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-foreground/35 hover:text-foreground transition-colors active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-5 h-5 shrink-0 flex items-center justify-center border-[1.5px] border-accent text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/55">
              Agregado al carrito
            </p>
          </div>

          <div className="flex gap-3.5 items-center">
            <div className="w-16 h-16 shrink-0 overflow-hidden bg-background border border-foreground/10 flex items-center justify-center">
              {item.imagen && !item.imagen.includes('PLACEHOLDER') ? (
                <img
                  src={clImg(item.imagen, 'w_128,f_auto,q_auto,c_fill')}
                  alt={item.nombre}
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                />
              ) : (
                <span className="font-heading font-black text-xl opacity-[0.08] select-none">
                  {item.nombre.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-heading font-bold text-[15px] text-foreground leading-snug line-clamp-2">
                {item.nombre}
              </p>
              <p className="font-body text-[13px] text-foreground/50 mt-1">
                {item.cantidad} × {formatPrice(item.precio)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 px-6 pb-6">
          <button
            type="button"
            onClick={handleViewCart}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white font-body font-bold text-[13px] uppercase tracking-[1.2px] px-6 py-3.5 transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Ver carrito
          </button>
          <button
            type="button"
            onClick={hideToast}
            className="flex items-center justify-center gap-1.5 py-1 text-foreground/55 hover:text-accent transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="font-body text-[12px] font-semibold uppercase tracking-[0.06em]">Seguir comprando</span>
          </button>
        </div>

        <div className="h-[3px] w-full bg-accent/15">
          <div
            className="toast-progress h-full bg-accent"
            style={{ animationDuration: `${TOAST_DURATION}ms` }}
          />
        </div>
      </div>
    </>
  )
}
