import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  productId: string
}

const LABELS = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente']

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="36"
      height="36"
      fill={filled ? 'hsl(6 63% 46%)' : 'none'}
      stroke={filled ? 'hsl(6 63% 46%)' : 'hsl(0 0% 75%)'}
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
  return (
    <div className="flex gap-1" role="group" aria-label="Seleccionar calificación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="p-1.5 cursor-pointer focus:outline-none active:scale-90 transition-transform"
          style={{ lineHeight: 0, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
        >
          <StarIcon filled={value >= n} />
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

  async function handleSubmit(e: React.SyntheticEvent) {
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
      <div className="border border-foreground/10 p-5 sm:p-6 flex items-center gap-3">
        <span style={{ color: 'hsl(6 63% 46%)', fontSize: '18px', lineHeight: 1 }}>✓</span>
        <p className="font-body text-sm text-foreground/55">Ya dejaste una reseña en este producto.</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="border-l-2 border-accent bg-card p-5 sm:p-6">
        <p className="font-body font-semibold text-sm text-foreground uppercase tracking-[0.65px]">¡Gracias!</p>
        <p className="font-body text-sm text-foreground/55 mt-1">Tu reseña será publicada tras revisión.</p>
      </div>
    )
  }

  const canSubmit = name.trim().length > 0 && rating > 0

  return (
    <div className="border-t border-foreground/10 pt-8 mt-2">
      <h3 className="font-heading font-bold text-base text-foreground uppercase tracking-[0.65px] mb-6">
        Dejar una reseña
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-body text-[11px] font-semibold text-foreground/50 mb-2 uppercase tracking-[0.65px]">
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-foreground/15 bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/30"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block font-body text-[11px] font-semibold text-foreground/50 mb-2 uppercase tracking-[0.65px]">
            Calificación <span aria-hidden="true">*</span>
          </label>
          <StarPicker value={rating} onChange={setRating} />
          <p className="font-body text-[11px] text-foreground/40 mt-1.5 h-4">
            {rating > 0 ? LABELS[rating] : ''}
          </p>
        </div>

        <div>
          <label className="block font-body text-[11px] font-semibold text-foreground/50 mb-2 uppercase tracking-[0.65px]">
            Comentario
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-foreground/15 bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-accent resize-none transition-colors placeholder:text-foreground/30"
            placeholder="Comparte tu experiencia con este producto..."
          />
        </div>

        {status === 'error' && (
          <p className="font-body text-sm" style={{ color: 'hsl(6 63% 46%)' }}>{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !canSubmit}
          className="w-full sm:w-auto bg-accent text-white text-[13px] font-body font-bold tracking-[1.4px] uppercase px-8 py-3.5 transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar reseña'}
        </button>
      </form>
    </div>
  )
}
