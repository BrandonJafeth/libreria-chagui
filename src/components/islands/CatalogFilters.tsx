import { useState, useMemo } from 'react'
import type { Product } from '../../lib/products'
import { addToCart, showToast } from '../../lib/cart'

function clImg(url: string, transforms: string): string {
  if (!url.includes('res.cloudinary.com')) return url
  return url.replace('/image/upload/', `/image/upload/${transforms}/`)
}

interface Props {
  products: Product[]
  tipos: string[]
  initialTipo?: string
}

const PAGE_SIZE = 8

function formatPrice(n: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
  }).format(n)
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

// Collapses long page runs to "1 … 4 5 6 … 16" so pagination stays a fixed,
// thumb-friendly width instead of cramming every page number into one row.
type PageItem = number | 'ellipsis'
function getPageItems(current: number, total: number): PageItem[] {
  const delta = 1
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)
  const items: PageItem[] = [1]

  if (left > 2) items.push('ellipsis')
  for (let i = left; i <= right; i++) items.push(i)
  if (right < total - 1) items.push('ellipsis')
  if (total > 1) items.push(total)

  return items
}

function ProductCard({ product }: { product: Product }) {
  const isPlaceholder = !product.imagenes[0] || product.imagenes[0].includes('PLACEHOLDER')
  const meta = getPlaceholderMeta(product.tipos)
  const isAgotado = product.estado === 'agotado'
  const [added, setAdded] = useState(false)

  function handleQuickAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (isAgotado) return
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagenes[0],
        color: product.colores[0]?.nombre,
      },
      1,
    )
    showToast({ nombre: product.nombre, imagen: product.imagenes[0], precio: product.precio, cantidad: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

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
            src={clImg(product.imagenes[0], 'w_600,f_auto,q_auto,c_fill')}
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
        {product.tipos[0] && (
          <span
            className="self-start text-[9px] font-bold uppercase tracking-wider"
            style={{
              background:   `${meta.accent}15`,
              color:        meta.accent,
              borderRadius: '4px',
              padding:      '2px 7px',
              marginBottom: '2px',
              display:      'inline-block',
            }}
          >
            {product.tipos[0]}
          </span>
        )}
        <p
          className="text-sm font-medium leading-snug line-clamp-2"
          style={{
            color:      isAgotado ? 'rgba(43,43,43,0.4)' : 'hsl(0 0% 17%)',
          }}
        >
          {product.nombre}
        </p>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p
            className="text-base font-semibold"
            style={{
              color:      isAgotado ? 'rgba(43,43,43,0.25)' : 'hsl(6 63% 46%)',
            }}
          >
            {formatPrice(product.precio)}
          </p>

          {!isAgotado && (
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Agregar ${product.nombre} al carrito`}
              className="shrink-0 flex items-center justify-center w-7 h-7 -mr-0.5 transition-all duration-200 active:scale-90"
              style={{ color: added ? 'hsl(150 40% 32%)' : 'rgba(43,43,43,0.4)' }}
            >
              {added ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </a>
  )
}

type SortKey = 'relevante' | 'alfabetico' | 'precio-asc' | 'precio-desc'

interface PriceRange {
  label: string
  min: number
  max: number
}

const PRICE_RANGES: PriceRange[] = [
  { label: 'Menos de ₡2.000',    min: 0,     max: 2000 },
  { label: '₡2.000 – ₡5.000',    min: 2000,  max: 5000 },
  { label: '₡5.000 – ₡10.000',   min: 5000,  max: 10000 },
  { label: 'Más de ₡10.000',     min: 10000, max: Infinity },
]

/* ─── sidebar filter section — native <details>, zero JS ───── */
function FilterSection({ title, open, children }: { title: string; open: boolean; children: React.ReactNode }) {
  return (
    <details className="group border-b border-foreground/8 py-3.5 first:pt-0 last:border-b-0" open={open}>
      <summary className="flex items-center justify-between cursor-pointer list-none select-none">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/70">{title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/35 transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </summary>
      <div className="mt-2.5 flex flex-col gap-0.5">
        {children}
      </div>
    </details>
  )
}

function FilterRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-left px-2 py-1.5 -mx-2 text-[13px] transition-colors"
      style={{
        borderRadius: '6px',
        background: active ? 'hsl(6 63% 46% / 0.08)' : 'transparent',
        color:      active ? 'hsl(6 63% 46%)' : 'rgba(43,43,43,0.6)',
        fontWeight: active ? 600 : 400,
      }}
    >
      <span
        className="shrink-0 rounded-full"
        style={{
          width: '6px',
          height: '6px',
          background: active ? 'hsl(6 63% 46%)' : 'rgba(43,43,43,0.18)',
        }}
        aria-hidden="true"
      />
      {children}
    </button>
  )
}

const chipStyle: React.CSSProperties = {
  fontSize:   '0.75rem',
  fontWeight: 500,
}

export default function CatalogFilters({ products, tipos, initialTipo }: Props) {
  const [selectedTipo,     setSelectedTipo]     = useState<string>(initialTipo ?? 'Todos')
  const [selectedPrice,    setSelectedPrice]    = useState<PriceRange | null>(null)
  const [soloDisponible,   setSoloDisponible]   = useState(false)
  const [query,            setQuery]            = useState('')
  const [sortBy,           setSortBy]           = useState<SortKey>('relevante')
  const [page,             setPage]             = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  function handleTipo(t: string)          { setSelectedTipo(t);          setPage(1) }
  function handlePrice(r: PriceRange | null) { setSelectedPrice(r);      setPage(1) }
  function handleDisponible()             { setSoloDisponible(v => !v);  setPage(1) }
  function handleQuery(q: string)         { setQuery(q);                 setPage(1) }
  function handleSort(s: SortKey)         { setSortBy(s);                setPage(1) }
  function clearAll() {
    setSelectedTipo('Todos'); setSelectedPrice(null); setSoloDisponible(false)
    setQuery(''); setSortBy('relevante'); setPage(1)
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchTipo   = selectedTipo === 'Todos' || p.tipos.includes(selectedTipo)
      const matchPrice  = !selectedPrice || (p.precio >= selectedPrice.min && p.precio < selectedPrice.max)
      const matchEstado = !soloDisponible || p.estado === 'disponible'
      const matchQuery  = query === '' || p.nombre.toLowerCase().includes(query.toLowerCase())
      return matchTipo && matchPrice && matchEstado && matchQuery
    })
    if (sortBy === 'precio-asc')  result = [...result].sort((a, b) => a.precio - b.precio)
    if (sortBy === 'precio-desc') result = [...result].sort((a, b) => b.precio - a.precio)
    if (sortBy === 'alfabetico')  result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    if (sortBy === 'relevante')   result = [...result].sort((a, b) => {
      const destacadoDiff = (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)
      return destacadoDiff !== 0 ? destacadoDiff : a.nombre.localeCompare(b.nombre, 'es')
    })
    return result
  }, [products, selectedTipo, selectedPrice, soloDisponible, query, sortBy])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (selectedTipo !== 'Todos') chips.push({ key: 'tipo', label: selectedTipo, onRemove: () => handleTipo('Todos') })
  if (selectedPrice)            chips.push({ key: 'price', label: selectedPrice.label, onRemove: () => handlePrice(null) })
  if (soloDisponible)           chips.push({ key: 'disp', label: 'Disponibles', onRemove: handleDisponible })
  if (query)                    chips.push({ key: 'query', label: `“${query}”`, onRemove: () => handleQuery('') })
  const hasActive = chips.length > 0

  const filterPanel = (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/80 mb-3">
        Filtrar por
      </p>

      <FilterSection title="Categoría" open={selectedTipo !== 'Todos'}>
        <FilterRow active={selectedTipo === 'Todos'} onClick={() => handleTipo('Todos')}>Todas</FilterRow>
        {tipos.map((t) => (
          <FilterRow key={t} active={selectedTipo === t} onClick={() => handleTipo(t)}>{t}</FilterRow>
        ))}
      </FilterSection>

      <FilterSection title="Precio" open={selectedPrice !== null}>
        {PRICE_RANGES.map((r) => (
          <FilterRow
            key={r.label}
            active={selectedPrice?.label === r.label}
            onClick={() => handlePrice(selectedPrice?.label === r.label ? null : r)}
          >
            {r.label}
          </FilterRow>
        ))}
      </FilterSection>

      <div className="pt-3.5">
        <button
          type="button"
          onClick={handleDisponible}
          className="flex items-center gap-2.5 text-[13px]"
          style={{ color: 'rgba(43,43,43,0.7)' }}
        >
          <span
            className="shrink-0 flex items-center justify-center"
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              border: `1.5px solid ${soloDisponible ? 'hsl(6 63% 46%)' : 'rgba(43,43,43,0.25)'}`,
              background: soloDisponible ? 'hsl(6 63% 46%)' : 'transparent',
            }}
          >
            {soloDisponible && (
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </span>
          Solo disponibles
        </button>
      </div>

      {hasActive && (
        <button
          onClick={clearAll}
          className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-70"
          style={{ color: 'hsl(6 63% 46%)' }}
        >
          Limpiar todos los filtros
        </button>
      )}
    </>
  )

  return (
    <div>
      {/* Mobile: filters toggle */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            border: '1px solid rgba(43,43,43,0.12)',
            borderRadius: '8px',
            background: 'white',
            color: 'rgba(43,43,43,0.75)',
            fontSize: '0.8125rem',
            fontWeight: 600,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" x2="20" y1="6" y2="6"/><line x1="8" x2="16" y1="12" y2="12"/><line x1="11" x2="13" y1="18" y2="18"/>
          </svg>
          Filtros
          {chips.length > 0 && (
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: '18px', height: '18px', background: 'hsl(6 63% 46%)', color: 'white', fontSize: '10px', fontWeight: 700 }}
            >
              {chips.length}
            </span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200" style={{ transform: mobileFiltersOpen ? 'rotate(180deg)' : 'none' }} aria-hidden="true">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8 lg:items-start">

        {/* Sidebar */}
        <aside
          className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block mb-6 lg:mb-0 lg:sticky`}
          style={{
            background:   'white',
            border:       '1px solid rgba(43,43,43,0.08)',
            borderRadius: '10px',
            boxShadow:    '0 1px 3px rgba(0,0,0,0.04)',
            padding:      '16px 16px 14px',
            top:          '148px',
          }}
        >
          {filterPanel}
        </aside>

        {/* Main column */}
        <div>
          {/* Search + sort */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-4">
            <div className="relative flex-1" style={{ minWidth: '140px' }}>
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
                placeholder="Buscar productos…"
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                style={{
                  fontSize:     '0.8125rem',
                  width:        '100%',
                  paddingLeft:  '30px',
                  paddingRight: '12px',
                  paddingTop:   '9px',
                  paddingBottom:'9px',
                  border:       '1px solid rgba(43,43,43,0.10)',
                  borderRadius: '8px',
                  background:   'white',
                  color:        'hsl(0 0% 17%)',
                  outline:      'none',
                }}
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as SortKey)}
                style={{
                  fontSize:     '0.8125rem',
                  fontWeight:   500,
                  border:       '1px solid rgba(43,43,43,0.10)',
                  borderRadius: '8px',
                  background:   'white',
                  color:        'rgba(43,43,43,0.62)',
                  padding:      '9px 28px 9px 13px',
                  appearance:   'none',
                  cursor:       'pointer',
                } as React.CSSProperties}
              >
                <option value="relevante">Relevantes</option>
                <option value="alfabetico">Alfabético (A-Z)</option>
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
          </div>

          {/* Count + active chips */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <p
              className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase shrink-0"
              style={{ color: 'rgba(43,43,43,0.3)' }}
            >
              {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
            </p>

            {chips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.onRemove}
                className="flex items-center gap-1.5 transition-colors hover:opacity-75"
                style={{
                  ...chipStyle,
                  padding: '4px 6px 4px 10px',
                  borderRadius: '999px',
                  background: 'hsl(6 63% 46% / 0.08)',
                  color: 'hsl(6 63% 46%)',
                }}
              >
                {chip.label}
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <svg className="mx-auto mb-4 opacity-20" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <p style={{ color: 'rgba(43,43,43,0.4)', fontSize: '0.9rem' }}>
                Sin resultados para esta búsqueda.
              </p>
              <button
                onClick={clearAll}
                className="mt-4 text-sm transition-opacity hover:opacity-70"
                style={{ color: 'hsl(6 63% 46%)' }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Paginación" className="flex items-center justify-center gap-1 sm:gap-1.5 mt-10">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                    style={{
                      width:        '34px',
                      height:       '34px',
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

                  {getPageItems(page, totalPages).map((item, i) =>
                    item === 'ellipsis' ? (
                      <span
                        key={`e${i}`}
                        aria-hidden="true"
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width:      '34px',
                          height:     '34px',
                          color:      'rgba(43,43,43,0.35)',
                          fontSize:   '0.8125rem',
                        }}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className="shrink-0 transition-all duration-200"
                        style={{
                          width:        '34px',
                          height:       '34px',
                          border:       `1px solid ${item === page ? 'hsl(6 63% 46%)' : 'rgba(43,43,43,0.12)'}`,
                          borderRadius: '6px',
                          background:   item === page ? 'hsl(6 63% 46%)' : 'transparent',
                          color:        item === page ? 'white' : 'rgba(43,43,43,0.55)',
                          fontSize:     '0.8125rem',
                          fontWeight:   item === page ? 600 : 400,
                          cursor:       'pointer',
                        }}
                        aria-current={item === page ? 'page' : undefined}
                        aria-label={`Página ${item}`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className="flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                    style={{
                      width:        '34px',
                      height:       '34px',
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
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
