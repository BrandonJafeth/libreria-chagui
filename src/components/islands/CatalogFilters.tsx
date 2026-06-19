import { useState, useMemo } from 'react'
import type { Product } from '../../lib/products'

interface Props {
  products: Product[]
  tipos: string[]
}

function formatPrice(n: number): string {
  return '₡' + n.toLocaleString('es-CR')
}

const tipoMeta: Record<string, { emoji: string; bg: string; accent: string }> = {
  'Escolar':    { emoji: '✏️', bg: 'linear-gradient(145deg, #FDF0D8 0%, #F9E4B4 100%)', accent: '#B87C20' },
  'Oficina':    { emoji: '📎', bg: 'linear-gradient(145deg, #EBF2FA 0%, #D8E8F5 100%)', accent: '#2E5C8A' },
  'Tecnología': { emoji: '⚡', bg: 'linear-gradient(145deg, #F1F3F5 0%, #E4E7EA 100%)', accent: '#4A5568' },
}

const fallbackMeta = { emoji: '📦', bg: 'linear-gradient(145deg, #FAF7F2 0%, #F0EBE3 100%)', accent: '#C0392B' }

function getPlaceholderMeta(tipos: string[]) {
  for (const t of tipos) {
    if (tipoMeta[t]) return tipoMeta[t]
  }
  return fallbackMeta
}

function ProductCard({ product }: { product: Product }) {
  const isPlaceholder = !product.imagenes[0] || product.imagenes[0].includes('PLACEHOLDER')
  const meta = getPlaceholderMeta(product.tipos)
  const isAgotado = product.estado === 'agotado'

  return (
    <a
      href={`/producto/${product.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: 'white',
        border: '1px solid rgba(43,43,43,0.07)',
        boxShadow: '0 1px 4px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.03)',
      }}
    >
      {/* Image / Placeholder */}
      <div
        className="aspect-square overflow-hidden relative"
        style={{ background: isPlaceholder ? meta.bg : 'hsl(37 33% 96%)' }}
      >
        {/* Category badge */}
        {product.tipos[0] && (
          <span
            className="absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
            style={{ background: `${meta.accent}18`, color: meta.accent }}
          >
            {product.tipos[0]}
          </span>
        )}

        {/* Sold-out overlay */}
        {isAgotado && (
          <div className="absolute inset-0 z-10 flex items-end justify-start p-2.5">
            <span className="rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-black/70 text-white/80">
              Agotado
            </span>
          </div>
        )}

        {isPlaceholder ? (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3 transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ opacity: isAgotado ? 0.45 : 1 }}
          >
            <span className="text-[3.2rem] leading-none select-none">{meta.emoji}</span>
            <span
              className="text-[0.55rem] font-bold tracking-[0.22em] uppercase select-none"
              style={{ color: meta.accent, opacity: 0.55 }}
            >
              Foto próximamente
            </span>
          </div>
        ) : (
          <img
            src={product.imagenes[0]}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <p
          className="text-sm font-medium leading-snug"
          style={{
            fontFamily: 'Poppins, sans-serif',
            color: isAgotado ? 'rgba(43,43,43,0.4)' : 'hsl(0 0% 17%)',
          }}
        >
          {product.nombre}
        </p>
        <p
          className="text-base font-semibold mt-1"
          style={{
            fontFamily: 'Poppins, sans-serif',
            color: isAgotado ? 'rgba(43,43,43,0.25)' : 'hsl(6 63% 46%)',
          }}
        >
          {formatPrice(product.precio)}
        </p>
      </div>
    </a>
  )
}

export default function CatalogFilters({ products, tipos }: Props) {
  const [selectedTipo,   setSelectedTipo]   = useState<string>('Todos')
  const [soloDisponible, setSoloDisponible] = useState(false)
  const [query,          setQuery]          = useState('')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchTipo   = selectedTipo === 'Todos' || p.tipos.includes(selectedTipo)
      const matchEstado = !soloDisponible || p.estado === 'disponible'
      const matchQuery  = query === '' || p.nombre.toLowerCase().includes(query.toLowerCase())
      return matchTipo && matchEstado && matchQuery
    })
  }, [products, selectedTipo, soloDisponible, query])

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center mb-3">
        {/* Tipo pills */}
        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
          {['Todos', ...tipos].map((t) => {
            const active = selectedTipo === t
            const m = tipoMeta[t]
            return (
              <button
                key={t}
                onClick={() => setSelectedTipo(t)}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 border whitespace-nowrap"
                style={{
                  background:   active ? 'hsl(6 63% 46%)' : 'transparent',
                  color:        active ? 'white' : 'rgba(43,43,43,0.55)',
                  borderColor:  active ? 'hsl(6 63% 46%)' : 'rgba(43,43,43,0.12)',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                {m ? `${m.emoji} ${t}` : t}
              </button>
            )
          })}
        </div>

        {/* Solo disponibles */}
        <button
          onClick={() => setSoloDisponible(v => !v)}
          className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 border whitespace-nowrap"
          style={{
            background:  soloDisponible ? 'rgba(46,92,138,0.09)' : 'transparent',
            color:       soloDisponible ? '#2E5C8A' : 'rgba(43,43,43,0.55)',
            borderColor: soloDisponible ? 'rgba(46,92,138,0.3)' : 'rgba(43,43,43,0.12)',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Solo disponibles
        </button>

        {/* Search */}
        <div className="relative w-full sm:w-52">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'rgba(43,43,43,0.35)' }}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="search"
            placeholder="Buscar producto…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-full border text-sm focus:outline-none transition-colors"
            style={{
              borderColor:  'rgba(43,43,43,0.12)',
              background:   'rgba(255,255,255,0.7)',
              color:        'hsl(0 0% 17%)',
              fontFamily:   'Inter, sans-serif',
            }}
          />
        </div>
      </div>

      {/* Result count */}
      <p
        className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-7"
        style={{ color: 'rgba(43,43,43,0.3)', fontFamily: 'Inter, sans-serif' }}
      >
        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-3xl mb-3 select-none">🔍</p>
          <p style={{ color: 'rgba(43,43,43,0.4)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
            Sin resultados para esta búsqueda.
          </p>
          <button
            onClick={() => { setSelectedTipo('Todos'); setSoloDisponible(false); setQuery('') }}
            className="mt-4 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'hsl(6 63% 46%)', fontFamily: 'Inter, sans-serif' }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
