import { useState } from 'react'
import { addToCart, openCart } from '../../lib/cart'

interface Props {
  productId: string
  slug: string
  nombre: string
  precio: number
  imagen?: string
  color?: string
  disabled?: boolean
}

export default function CartButton({ productId, slug, nombre, precio, imagen, color, disabled }: Props) {
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  function handleAdd() {
    addToCart({ productId, slug, nombre, precio, imagen, color }, qty)
    setJustAdded(true)
    openCart()
    setTimeout(() => setJustAdded(false), 1800)
    setQty(1)
  }

  return (
    <div className="flex items-stretch gap-3 h-[54px]">
      {/* Quantity stepper */}
      <div className="flex items-stretch border-[1.5px] border-foreground/20 shrink-0">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={disabled}
          aria-label="Restar cantidad"
          className="w-11 flex items-center justify-center text-foreground/60 hover:text-accent hover:bg-accent/5 active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <span className="w-9 flex items-center justify-center border-x-[1.5px] border-foreground/20 font-body font-semibold text-sm text-foreground tabular-nums select-none">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          disabled={disabled}
          aria-label="Sumar cantidad"
          className="w-11 flex items-center justify-center text-foreground/60 hover:text-accent hover:bg-accent/5 active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="flex-1 min-w-0 px-6 font-body font-semibold text-[13px] uppercase tracking-[1.4px] transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2"
        style={{
          background: justAdded ? 'hsl(150 40% 32%)' : 'hsl(6 63% 46%)',
          color: 'white',
        }}
      >
        {justAdded ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Agregado
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Agregar al carrito
          </>
        )}
      </button>
    </div>
  )
}
