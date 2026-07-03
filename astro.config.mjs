import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import cloudflare from '@astrojs/cloudflare'
import { createClient } from '@supabase/supabase-js'
import { existsSync } from 'node:fs'

if (existsSync('.env')) process.loadEnvFile('.env')

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
)

const { data: products, error } = await supabase.from('products').select('slug')
if (error) throw new Error(`Sitemap: failed to fetch product slugs: ${error.message}`)

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