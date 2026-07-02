import { useStore } from '@nanostores/react'
import { cartCount, openCart } from '../../lib/cart'
import { useMounted } from '../../lib/useMounted'

interface Props {
  light?: boolean
}

export default function CartIcon({ light = false }: Props) {
  const mounted = useMounted()
  const storeCount = useStore(cartCount)
  const count = mounted ? storeCount : 0

  return (
    <button
      onClick={openCart}
      aria-label={`Ver carrito${count > 0 ? ` (${count} producto${count === 1 ? '' : 's'})` : ''}`}
      className="relative flex items-center justify-center w-9 h-9 shrink-0 transition-transform active:scale-90"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={light ? 'white' : 'currentColor'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={light ? '' : 'text-white/80'}
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {count > 0 && (
        <span
          key={count}
          className="cart-badge absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
          style={
            light
              ? { background: 'white', color: 'hsl(6 63% 42%)' }
              : { background: 'hsl(6 63% 46%)', color: 'white' }
          }
        >
          {count > 9 ? '9+' : count}
        </span>
      )}

      <style>{`
        @keyframes cart-badge-pop {
          0%   { transform: scale(0.4); }
          60%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .cart-badge {
          animation: cart-badge-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </button>
  )
}
