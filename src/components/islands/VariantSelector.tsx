import { useState } from 'react'
import type { Product } from '../../lib/products'

interface Props {
  product: Product
}

const WA_PHONE = '50663595383'

function buildWAUrl(nombre: string, color?: string, tipo?: string): string {
  let msg = `Hola buenas, me interesa el producto: ${nombre}`
  const extras: string[] = []
  if (color) extras.push(color)
  if (tipo && tipo !== nombre) extras.push(tipo)
  if (extras.length) msg += ` (${extras.join(', ')})`
  return `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(msg)}`
}

export default function VariantSelector({ product }: Props) {
  const hasColors  = product.colores.length > 0
  const hasVariants = product.tipos.length > 1

  const [selectedColor,   setSelectedColor]   = useState<string>(product.colores[0] ?? '')
  const [selectedVariant, setSelectedVariant] = useState<string>(product.tipos[0] ?? '')

  const agotado = product.estado === 'agotado'
  const waUrl = buildWAUrl(
    product.nombre,
    hasColors   ? selectedColor   : undefined,
    hasVariants ? selectedVariant : undefined,
  )

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
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 text-sm font-body font-medium border transition-all ${
                  selectedColor === color
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-foreground/25 text-foreground/70 hover:border-foreground/50 hover:text-foreground'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variant/tipo selector (only when multiple tipos = actual variants) */}
      {hasVariants && (
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-foreground/65 mb-2.5 font-body font-semibold">
            Presentación: <span className="font-bold text-foreground/85">{selectedVariant}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.tipos.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setSelectedVariant(tipo)}
                className={`px-4 py-2 text-sm font-body font-medium border transition-all ${
                  selectedVariant === tipo
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-foreground/25 text-foreground/70 hover:border-foreground/50 hover:text-foreground'
                }`}
              >
                {tipo}
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
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto px-8 py-4 mt-2 bg-accent text-white font-body font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Consultar por WhatsApp
        </a>
      )}
    </div>
  )
}
