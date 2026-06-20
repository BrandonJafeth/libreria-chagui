import { useState, useMemo } from 'react'
import type { Product } from '../../lib/products'

interface Props {
  products: Product[]
  tipos: string[]
}

const PAGE_SIZE = 8

function formatPrice(n: number): string {
  return '₡' + n.toLocaleString('es-CR')
}

const tipoMeta: Record<string, { bg: string; accent: string }> = {
  'Escolar':    { bg: 'linear-gradient(145deg, #FDF0D8 0%, #F9E4B4 100%)', accent: '#B87C20' },
  'Oficina':    { bg: 'linear-gradient(145deg, #EBF2FA 0%, #D8E8F5 100%)', accent: '#2E5C8A' },
  'Tecnología': { bg: 'linear-gradient(145deg, #F1F3F5 0%, #E4E7EA 100%)', accent: '#4A5568' },
}

const fallbackMeta = { bg: 'linear-gradient(145deg, #FAF7F2 0%, #F0EBE3 100%)', accent: '#C0392B' }

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
      className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background:   'white',
        border:       '1px solid rgba(43,43,43,0.07)',
        borderRadius: '12px',
        boxShadow:    '0 1px 4px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.03)',
      }}
    >
      <div
        className="aspect-square overflow-hidden relative"
        style={{ background: isPlaceholder ? meta.bg : 'hsl(37 33% 96%)' }}
      >
        {product.tipos[0] && (
          <span
            className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
            style={{
              background:   `${meta.accent}18`,
              color:        meta.accent,
              borderRadius: '4px',
            }}
          >
            {product.tipos[0]}
          </span>
        )}

        {isAgotado && (
          <div className="absolute inset-0 z-10 flex items-end justify-start p-2.5">
            <span
              className="px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-black/70 text-white/80"
              style={{ borderRadius: '4px' }}
            >
              Agotado
            </span>
          </div>
        )}

        {isPlaceholder ? (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3 transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ opacity: isAgotado ? 0.45 : 1 }}
          >
            <span
              className="font-sans font-black leading-none select-none"
              style={{ fontSize: '3.5rem', color: 'rgba(0,0,0,0.06)' }}
            >
              {product.nombre.charAt(0).toUpperCase()}
            </span>
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
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <p
          className="text-sm font-medium leading-snug"
          style={{
            fontFamily: 'Inter, sans-serif',
            color:      isAgotado ? 'rgba(43,43,43,0.4)' : 'hsl(0 0% 17%)',
          }}
        >
          {product.nombre}
        </p>
        <p
          className="text-base font-semibold mt-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            color:      isAgotado ? 'rgba(43,43,43,0.25)' : 'hsl(6 63% 46%)',
          }}
        >
          {formatPrice(product.precio)}
        </p>
      </div>
    </a>
  )
}

type SortKey = 'relevante' | 'precio-asc' | 'precio-desc'

/* ─── tiny shared pill style ───────────────────────────────── */
const pillBase: React.CSSProperties = {
  fontFamily:  'Inter, sans-serif',
  fontSize:    '0.8125rem',
  fontWeight:  500,
  lineHeight:  1,
  whiteSpace:  'nowrap',
  cursor:      'pointer',
  transition:  'background 0.18s, color 0.18s, border-color 0.18s',
  border:      '1px solid transparent',
  borderRadius:'6px',
  padding:     '6px 13px',
  display:     'inline-flex',
  alignItems:  'center',
  gap:         '5px',
}

export default function CatalogFilters({ products, tipos }: Props) {
  const [selectedTipo,   setSelectedTipo]   = useState<string>('Todos')
  const [soloDisponible, setSoloDisponible] = useState(false)
  const [query,          setQuery]          = useState('')
  const [sortBy,         setSortBy]         = useState<SortKey>('relevante')
  const [page,           setPage]           = useState(1)

  function handleTipo(t: string)   { setSelectedTipo(t);         setPage(1) }
  function handleDisponible()       { setSoloDisponible(v => !v); setPage(1) }
  function handleQuery(q: string)  { setQuery(q);                setPage(1) }
  function handleSort(s: SortKey)  { setSortBy(s);               setPage(1) }
  function clearAll()               {
    setSelectedTipo('Todos'); setSoloDisponible(false); setQuery(''); setSortBy('relevante'); setPage(1)
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchTipo   = selectedTipo === 'Todos' || p.tipos.includes(selectedTipo)
      const matchEstado = !soloDisponible || p.estado === 'disponible'
      const matchQuery  = query === '' || p.nombre.toLowerCase().includes(query.toLowerCase())
      return matchTipo && matchEstado && matchQuery
    })
    if (sortBy === 'precio-asc')  result = [...result].sort((a, b) => a.precio - b.precio)
    if (sortBy === 'precio-desc') result = [...result].sort((a, b) => b.precio - a.precio)
    if (sortBy === 'relevante')   result = [...result].sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0))
    return result
  }, [products, selectedTipo, soloDisponible, query, sortBy])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasActive  = selectedTipo !== 'Todos' || soloDisponible || query !== '' || sortBy !== 'relevante'

  return (
    <div>

      {/* ══════════════════════════════════════════
          FILTER TOOLBAR
          Desktop: single row — categories | divider | controls
          Mobile:  two stacked rows
      ══════════════════════════════════════════ */}
      <div
        className="mb-6"
        style={{
          background:   'white',
          border:       '1px solid rgba(43,43,43,0.08)',
          borderRadius: '10px',
          boxShadow:    '0 1px 3px rgba(0,0,0,0.04)',
          padding:      '10px 12px',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">

          {/* LEFT — category tabs */}
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
            {['Todos', ...tipos].map((t) => {
              const active = selectedTipo === t
              const m      = tipoMeta[t]
              return (
                <button
                  key={t}
                  onClick={() => handleTipo(t)}
                  style={{
                    ...pillBase,
                    background:  active ? 'hsl(6 63% 46%)' : 'transparent',
                    color:       active ? 'white' : 'rgba(43,43,43,0.52)',
                    borderColor: active ? 'hsl(6 63% 46%)' : 'rgba(43,43,43,0.10)',
                    fontWeight:  active ? 600 : 500,
                  }}
                >
                  {active && (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
                  )}
                  {t}
                </button>
              )
            })}
          </div>

          {/* DIVIDER — desktop only */}
          <div
            className="hidden md:block shrink-0 self-stretch"
            style={{ width: '1px', background: 'rgba(43,43,43,0.08)', margin: '0 12px' }}
            aria-hidden="true"
          />

          {/* RIGHT — availability + sort + search */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">

            {/* Solo disponibles */}
            <button
              onClick={handleDisponible}
              style={{
                ...pillBase,
                background:  soloDisponible ? 'rgba(46,92,138,0.08)' : 'transparent',
                color:       soloDisponible ? '#2E5C8A'              : 'rgba(43,43,43,0.52)',
                borderColor: soloDisponible ? 'rgba(46,92,138,0.25)' : 'rgba(43,43,43,0.10)',
              }}
            >
              {/* checkmark icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: soloDisponible ? 1 : 0.4 }}>
                {soloDisponible
                  ? <polyline points="20 6 9 17 4 12"/>
                  : <circle cx="12" cy="12" r="8"/>
                }
              </svg>
              Disponibles
            </button>

            {/* Sort select */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as SortKey)}
                style={{
                  ...pillBase,
                  borderColor: 'rgba(43,43,43,0.10)',
                  background:  'transparent',
                  color:       'rgba(43,43,43,0.52)',
                  paddingRight: '28px',
                  appearance:  'none',
                  cursor:      'pointer',
                } as React.CSSProperties}
              >
                <option value="relevante">Relevantes</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
              </select>
              <svg
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: 'rgba(43,43,43,0.35)' }} aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>

            {/* Search */}
            <div className="relative flex-1 sm:flex-none" style={{ minWidth: '160px' }}>
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: 'rgba(43,43,43,0.32)' }} aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                type="search"
                placeholder="Buscar…"
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                style={{
                  fontFamily:  'Inter, sans-serif',
                  fontSize:    '0.8125rem',
                  width:       '100%',
                  paddingLeft: '30px',
                  paddingRight:'12px',
                  paddingTop:  '6px',
                  paddingBottom:'6px',
                  border:      '1px solid rgba(43,43,43,0.10)',
                  borderRadius:'6px',
                  background:  'transparent',
                  color:       'hsl(0 0% 17%)',
                  outline:     'none',
                }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Result count + clear */}
      <div className="flex items-center gap-3 mb-7">
        <p
          className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
          style={{ color: 'rgba(43,43,43,0.3)', fontFamily: 'Inter, sans-serif' }}
        >
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
        </p>
        {hasActive && (
          <button
            onClick={clearAll}
            className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-70"
            style={{ color: 'hsl(6 63% 46%)', fontFamily: 'Inter, sans-serif' }}
          >
            × Limpiar
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <svg className="mx-auto mb-4 opacity-20" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <p style={{ color: 'rgba(43,43,43,0.4)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
            Sin resultados para esta búsqueda.
          </p>
          <button
            onClick={clearAll}
            className="mt-4 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'hsl(6 63% 46%)', fontFamily: 'Inter, sans-serif' }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                style={{
                  width:        '32px',
                  height:       '32px',
                  border:       '1px solid rgba(43,43,43,0.12)',
                  borderRadius: '6px',
                  background:   'transparent',
                  color:        'rgba(43,43,43,0.55)',
                  cursor:       'pointer',
                }}
                aria-label="Página anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                const active = n === page
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className="transition-all duration-200"
                    style={{
                      width:        '32px',
                      height:       '32px',
                      border:       `1px solid ${active ? 'hsl(6 63% 46%)' : 'rgba(43,43,43,0.12)'}`,
                      borderRadius: '6px',
                      background:   active ? 'hsl(6 63% 46%)' : 'transparent',
                      color:        active ? 'white' : 'rgba(43,43,43,0.55)',
                      fontFamily:   'Inter, sans-serif',
                      fontSize:     '0.8125rem',
                      fontWeight:   active ? 600 : 400,
                      cursor:       'pointer',
                    }}
                    aria-current={active ? 'page' : undefined}
                  >
                    {n}
                  </button>
                )
              })}

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                style={{
                  width:        '32px',
                  height:       '32px',
                  border:       '1px solid rgba(43,43,43,0.12)',
                  borderRadius: '6px',
                  background:   'transparent',
                  color:        'rgba(43,43,43,0.55)',
                  cursor:       'pointer',
                }}
                aria-label="Página siguiente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
