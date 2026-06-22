import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  productId: string
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill={filled ? 'hsl(6 63% 46%)' : 'none'}
      stroke={filled ? 'hsl(6 63% 46%)' : 'hsl(0 0% 70%)'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div className="flex gap-0.5" role="group" aria-label="Seleccionar calificación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="p-1 cursor-pointer focus:outline-none"
          style={{ lineHeight: 0 }}
        >
          <StarIcon filled={active >= n} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewForm({ productId }: Props) {
  const storageKey = `reviewed_${productId}`
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'done'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (localStorage.getItem(storageKey)) {
      setStatus('done')
    }
  }, [storageKey])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !rating) return

    setStatus('loading')
    const { error } = await supabase
      .from('product_reviews')
      .insert({ product_id: productId, author_name: name.trim(), rating, comment: comment.trim() || null })

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      localStorage.setItem(storageKey, '1')
      setStatus('success')
    }
  }

  if (status === 'done') {
    return (
      <div className="bg-card border border-foreground/8 p-8 text-center">
        <p className="font-body text-sm text-foreground/55">
          Ya dejaste una reseña en este producto.
        </p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="bg-card border border-foreground/8 p-8 text-center">
        <p className="font-body text-foreground text-base">
          ¡Gracias! Tu reseña será publicada tras revisión.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card p-8 border border-foreground/8">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
        Dejar una reseña
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block font-body text-[11px] font-semibold text-foreground/55 mb-1.5 uppercase tracking-[0.65px]">
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-foreground/15 bg-background px-3 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block font-body text-[11px] font-semibold text-foreground/55 mb-1 uppercase tracking-[0.65px]">
            Calificación <span aria-hidden="true">*</span>
          </label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <div>
          <label className="block font-body text-[11px] font-semibold text-foreground/55 mb-1.5 uppercase tracking-[0.65px]">
            Comentario
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-foreground/15 bg-background px-3 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-accent resize-none transition-colors"
            placeholder="Comparte tu experiencia con este producto..."
          />
        </div>

        {status === 'error' && (
          <p className="font-body text-sm" style={{ color: 'hsl(6 63% 46%)' }}>{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !name.trim() || !rating}
          className="bg-accent text-white text-[13px] font-body font-bold tracking-[1.4px] uppercase px-8 py-3 transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar reseña'}
        </button>
      </div>
    </form>
  )
}
