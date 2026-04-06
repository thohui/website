import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  site: 'https://thohui.com',
  integrations: [sitemap(), mdx()],
  image: {
    service: passthroughImageService()
  },
});