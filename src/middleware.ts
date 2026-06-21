import { defineMiddleware } from 'astro:middleware'
export const onRequest = defineMiddleware((_ctx, next) => {
  return next().then((response) => {
    const ct = response.headers.get('Content-Type') ?? ''
    if (ct.includes('text/html')) {
      response.headers.set('Cache-Control', 'max-age=0, s-maxage=60, stale-while-revalidate=30')
      response.headers.set('X-Frame-Options', 'SAMEORIGIN')
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    }
    return response
  })
})
