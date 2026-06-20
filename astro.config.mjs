import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
  site: 'https://libreriafchagui.com',
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [react(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom', 'react-dom/server'],
    },
  },
  image: { domains: ['res.cloudinary.com', 'zhmpgxpvxitzrfrbitmp.supabase.co'] },
})