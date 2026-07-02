import { useEffect, useState } from 'react'

// nanostores' persistentAtom reads localStorage synchronously on the client but
// SSR always renders the empty/default value — gate on this to avoid hydration
// mismatches for any store-derived UI (cart badge, drawer contents, etc.).
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
