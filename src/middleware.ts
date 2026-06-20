import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((_ctx, next) => {
  return next().then((response) => {
    response.headers.set('Cache-Control', 'no-store')
    return response
  })
})
