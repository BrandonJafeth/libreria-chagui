import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import cloudflare from '@astrojs/cloudflare'
import { products } from './src/data/products.ts'

const productUrls = products.map(
  (p) => `https://libreriafchagui.com/producto/${p.slug}`
)

export default defineConfig({
  site: 'https://libreriafchagui.com',
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [react(), sitemap({ customPages: productUrls }), icon()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom', 'react-dom/server'],
    },
  },
  image: { domains: ['res.cloudinary.com', 'zhmpgxpvxitzrfrbitmp.supabase.co'] },
})