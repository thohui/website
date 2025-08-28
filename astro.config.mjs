import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  site: 'https://thohui.com',
  integrations: [sitemap()],
  image: {
    service: passthroughImageService()
  },
});