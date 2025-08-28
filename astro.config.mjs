import { defineConfig, passthroughImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  image: {
    service: passthroughImageService()
  },
});