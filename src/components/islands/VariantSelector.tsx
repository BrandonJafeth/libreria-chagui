import { useState } from 'react'
import type { Product } from '../../lib/products'
import { formatPrice } from '../../lib/format'
import CartButton from './CartButton'

interface Props {
  product: Product
}

const WA_PHONE = '50663595383'

function buildWAUrl(nombre: string, precio: number, color?: string): string {
  let msg = `Hola buenas, me interesa el producto: ${nombre}`
  if (color) msg += ` (${color})`
  msg += ` — Precio: ${formatPrice(precio)}`
  return `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(msg)}`
}

export default function VariantSelector({ product }: Props) {
  const hasColors = product.colores.length > 0

  const [selectedColor, setSelectedColor] = useState<string>(product.colores[0]?.nombre ?? '')

  const agotado = product.estado === 'agotado'
  const waUrl = buildWAUrl(product.nombre, product.precio, hasColors ? selectedColor : undefined)

  return (
    <div className="flex flex-col gap-5">
      {/* Color selector */}
      {hasColors && (
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-foreground/65 mb-2.5 font-body font-semibold">
            Color: <span className="font-bold text-foreground/85">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colores.map((color) => (
              <button
                key={color.nombre}
                onClick={() => setSelectedColor(color.nombre)}
                className={`px-4 py-2 text-sm font-body font-medium border transition-all flex items-center gap-2 ${
                  selectedColor === color.nombre
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-foreground/25 text-foreground/70 hover:border-foreground/50 hover:text-foreground'
                }`}
              >
                {color.hex && (
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ background: color.hex }}
                  />
                )}
                {color.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {agotado ? (
        <button
          disabled
          className="w-full md:w-auto px-8 py-4 mt-2 font-body font-semibold text-sm uppercase tracking-wider bg-foreground/10 text-foreground/55 cursor-not-allowed flex items-center justify-center gap-2"
        >
          Agotado
        </button>
      ) : (
        <div className="mt-2 flex flex-col gap-4">
          <CartButton
            productId={product.id}
            slug={product.slug}
            nombre={product.nombre}
            precio={product.precio}
            imagen={product.imagenes[0]}
            color={hasColors ? selectedColor : undefined}
          />
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-1.5 font-body text-xs font-medium text-foreground/45 hover:text-accent transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.97 0-1.41.74-2.1 1-2.39.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.81 1.99.88 2.13.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.23.63-.14.26.09 1.66.78 1.94.93.28.14.47.21.53.33.07.12.07.68-.17 1.35Z" />
            </svg>
            ¿Preguntas? Consultá por WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
