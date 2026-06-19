import { useState } from 'react'

interface Props {
  images: string[]
  alt: string
}

export default function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card to-background flex items-center justify-center border border-white/60">
        <span className="font-sans text-[4rem] leading-none opacity-[0.08] select-none">📦</span>
      </div>
    )
  }

  const isPlaceholder = (src: string) => src.includes('PLACEHOLDER')

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square rounded-3xl overflow-hidden border border-white/60 bg-gradient-to-br from-card to-background flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,.07), 0 8px 32px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,1)' }}>
        {isPlaceholder(images[active]) ? (
          <span className="font-sans text-[5rem] leading-none opacity-[0.06] select-none">📦</span>
        ) : (
          <img
            src={images[active]}
            alt={`${alt} — imagen ${active + 1}`}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-gradient-to-br from-card to-background flex items-center justify-center shrink-0 ${
                i === active
                  ? 'border-accent ring-1 ring-accent'
                  : 'border-white/60 hover:border-foreground/30'
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              {isPlaceholder(src) ? (
                <span className="text-lg opacity-20">📦</span>
              ) : (
                <img src={src} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
