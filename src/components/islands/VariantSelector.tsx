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
        <div className="mt-2 flex flex-col gap-3">
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
            className="self-start font-body text-xs text-foreground/45 hover:text-accent transition-colors underline decoration-foreground/20 underline-offset-4"
          >
            ¿Preguntas? Consultá por WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
