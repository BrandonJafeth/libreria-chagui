import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((_ctx, next) => {
  return next().then((response) => {
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=30')
    return response
  })
})
